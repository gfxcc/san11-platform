import logging
import os
from email import message
from typing import Iterable, List, Optional, Tuple, Type, Union

from handler.common.env import Env, get_env
from handler.common.validation import require_admin
from handler.handler_context import HandlerContext
from handler.model.base import (Context, FieldMask, HandlerBase, ModelBase,
                                merge_resource)
from handler.model.base import ListOptions
from handler.model.model_binary import ModelBinary
from handler.model.model_package import ModelPackage
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser, get_admins
from handler.model.plugins.tracklifecycle import (Action, ModelActivity,
                                                  search_activity)
from handler.repository import repository_for
from handler.util.file_server import (BucketClass, FileServerType,
                                      get_file_server)
from handler.util.name_util import get_parent
from handler.util.resource_view import ResourceViewVisitor
from handler.util.state_util import on_approve
from handler.util.time_util import get_now

from .protos import san11_platform_pb2 as pb
from .util.notifier import notify, notify_on_creation, send_email

logger = logging.getLogger(os.path.basename(__file__))


def filter_packages_based_on_requester(packages: Iterable[ModelPackage],
                                       requester: Optional[ModelUser]) -> List[ModelPackage]:
    if requester is None:
        # Most users (including anonymous users) should only see packages in
        # `NORMAL` state.
        packages = list(filter(lambda x: x.state in [
            pb.ResourceState.NORMAL], packages))
    else:
        # Admin user can see all packages.
        # Users who also publish packages will also see packages they published
        # in `HIDDEN`, `UNDER_REVIEW` state.
        packages = list(filter(lambda x: requester.type == pb.User.UserType.ADMIN or
                               x.state == pb.ResourceState.NORMAL or
                               (x.author_id == requester.user_id and
                                x.state in [pb.ResourceState.HIDDEN,
                                            pb.ResourceState.UNDER_REVIEW]),
                               packages))
    return packages


class PackageHandler(HandlerBase):
    def __init__(self, package_repository=None, binary_repository=None,
                 thread_repository=None):
        self.package_repository = package_repository or repository_for(ModelPackage)
        self.binary_repository = binary_repository or repository_for(ModelBinary)
        self.thread_repository = thread_repository or repository_for(ModelThread)

    def create(self, parent: str, package: ModelPackage, handler_context: HandlerContext) -> ModelPackage:
        package.author_id = handler_context.user.user_id
        package.state = pb.ResourceState.UNDER_REVIEW
        self.package_repository.create(
            parent=parent, resource=package, actor_info=handler_context.user.user_id)
        # Post creation actions
        try:
            view = ResourceViewVisitor().visit(package)  # type: ignore
            for admin in get_admins():
                notify(
                    sender=handler_context.user,
                    receiver=admin,
                    content=f'【待审核】{handler_context.user.username} 创建了 {view.display_name}。',
                    link=view.name,
                    image_preview=view.image_url)
        except Exception as err:
            logger.error(f'Failed to notify admin: {err}')
        return package

    def get(self, name: str, handler_context: HandlerContext) -> ModelPackage:
        return self.package_repository.get(name)

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelPackage], str]:
        # (TODO): Due to ListOptions.filter does not support `OR` operation, we
        # will do list without any filter and hide content later manually.
        # This should be replaced with different `filter` expression later when
        # possible.
        packages, next_page_token = self.package_repository.list(list_options)
        return filter_packages_based_on_requester(packages, handler_context.user), next_page_token

    def update(self, update_package: ModelPackage, update_mask: FieldMask, handler_context: HandlerContext) -> ModelPackage:
        def verify_permission_on_update(curr: ModelPackage, dest: ModelPackage, update_mask: FieldMask) -> None:
            if on_approve(curr.state, dest.state):
                require_admin(handler_context.user,
                              message='审核通过新工具需要管理员权限')

        base_package = self.package_repository.get(update_package.name)
        if update_mask.has('state'):
            verify_permission_on_update(
                base_package, update_package, update_mask)

        # Remove `like_count`, `dislike_count` from update_mask here and handle the count update
        #   explicitly later.
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'like_count', 'dislike_count'})
        package = merge_resource(base_resource=base_package,
                                 update_request=update_package,
                                 field_mask=sanitized_update_mask)
        user_id = handler_context.user.user_id

        if update_mask.has('like_count'):
            package.toggle_like(handler_context.user.name)
        if update_mask.has('dislike_count'):
            package.toggle_dislike(handler_context.user.name)

        # Delete image resources
        if update_mask.has('image_urls'):
            file_server = get_file_server(FileServerType.GCS)
            for image_url_to_delete in set(base_package.image_urls) - set(update_package.image_urls):
                try:
                    file_server.delete_file(
                        BucketClass.REGULAR, image_url_to_delete)
                except Exception as err:
                    logger.error(
                        f'Failed to delete {image_url_to_delete}: {err}')

        is_visitor = True if set(update_mask.paths) <= {
            'like_count', 'dislike_count'} else False
        if is_visitor:
            self.package_repository.update(package, update_update_time=False)
        else:
            self.package_repository.update(package, actor_info=user_id)

        if on_approve(
                pb.ResourceState.DESCRIPTOR.values_by_number[base_package.state],
                pb.ResourceState.DESCRIPTOR.values_by_number[update_package.state]):
            notify_on_creation(package)
        return package

    def delete(self, name: str, handler_context: HandlerContext) -> ModelPackage:
        package = self.package_repository.get(name)
        for binary in self.binary_repository.list(ListOptions(parent=package.name))[0]:
            try:
                self.binary_repository.delete(
                    binary, actor_info=handler_context.user.user_id)
            except Exception as err:
                logger.error(
                    f'Failed to delete binary: binary={binary} err={err}')
        for thread in self.thread_repository.list(ListOptions(parent=package.name))[0]:
            try:
                self.thread_repository.delete(
                    thread, actor_info=handler_context.user.user_id)
            except Exception as err:
                logger.error(f'Failed to delete {thread} under {self}: {err}')

        get_file_server(FileServerType.GCS).delete_by_prefix(
            BucketClass.REGULAR, package.name)
        get_file_server(FileServerType.S3).delete_by_prefix(
            BucketClass.REGULAR, package.name)
        return self.package_repository.delete(
            package, actor_info=handler_context.user.user_id)

    def search_packages(self, request, context):
        # (TODO): Reimplement this with ModelPackage
        # packages, next_page_token = self.package_repository.list(list_options=ListOptions(
        #     parent=None,
        #     filter=request.query,
        # ))
        return pb.SearchPackagesResponse()
