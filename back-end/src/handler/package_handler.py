import logging
import os
from email import message
from typing import Iterable, List, Optional, Tuple, Type, Union

from handler.common.env import Env, get_env
from handler.common.exception import PermissionDenied
from handler.handler_context import HandlerContext
from handler.model.activity import Action
from handler.model.base import (Context, FieldMask, HandlerBase, ModelBase,
                                merge_resource)
from handler.model.base.base_db import ListOptions
from handler.model.model_activity import ModelActivity, search_activity
from handler.model.model_binary import ModelBinary
from handler.model.model_legacy_subscription import ModelLegacySubscription
from handler.model.model_package import ModelPackage
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser, get_admins
from handler.util.file_server import (BucketClass, FileServerType,
                                      get_file_server)
from handler.util.resource_view import ResourceViewVisitor
from handler.util.state_util import on_approve
from handler.util.time_util import get_now

from .common.image import Image
from .protos import san11_platform_pb2 as pb
from .util.notifier import Notifier, notify, send_message

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
    def create(self, parent: str, package: ModelPackage, handler_context: HandlerContext) -> ModelPackage:
        package.author_id = handler_context.user.user_id
        package.state = pb.ResourceState.UNDER_REVIEW
        package.create(parent=parent, user_id=handler_context.user.user_id)
        # Post creation actions
        try:
            notifer = Notifier()
            view = ResourceViewVisitor().visit(package)
            for admin in get_admins():
                notify(sender_id=package.author_id, receiver_id=admin.user_id,
                       content=f'【待审核】{handler_context.user.username} 创建了 {view.display_name}。', link=view.name, image_preview=view.image_url)
                if get_env() == Env.PROD:
                    notifer.send_email(
                        admin.email, '【新内容】待审核', f'[{package.package_name}] 已被 {handler_context.user.username} 创建。请审核。')
        except Exception as err:
            logger.error(f'Failed to notify admin: {err}')
        return package

    def get(self, name: str, handler_context: HandlerContext) -> ModelPackage:
        return ModelPackage.from_name(name)

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelPackage], str]:
        # (TODO): Due to ListOptions.filter does not support `OR` operation, we
        # will do list without any filter and hide content later manually.
        # This should be replaced with different `filter` expression later when
        # possible.
        packages, next_page_token = ModelPackage.list(list_options)
        return filter_packages_based_on_requester(packages, handler_context.user), next_page_token

    def update(self, update_package: ModelPackage, update_mask: FieldMask, handler_context: HandlerContext) -> ModelPackage:
        def verify_permission_on_update(curr: ModelPackage, dest: ModelPackage, update_mask: FieldMask) -> None:
            if on_approve(curr.state, dest.state):
                # Approve new package
                if not handler_context.user.is_admin():
                    raise PermissionDenied(message='审核通过新工具需要管理员权限')

        def toggle_like_dislike(user_id: int, action: Action, package: ModelPackage):
            action2field = {
                Action.LIKE: 'like_count',
                Action.DISLIKE: 'dislike_count',
            }
            act1 = search_activity(
                f'users/{user_id}', action, package.name)
            if act1:
                act1.delete()
                setattr(package, action2field[action], getattr(
                    package, action2field[action]) - 1)
            else:
                ModelActivity('', get_now(), action.value, package.name).create(
                    parent=f'users/{user_id}')
                setattr(package, action2field[action], getattr(
                    package, action2field[action]) + 1)

                reversed_action = Action.DISLIKE if action == Action.LIKE else Action.LIKE
                act2 = search_activity(
                    f'users/{user_id}', reversed_action, package.name)
                if act2:
                    act2.delete()
                    setattr(package, action2field[reversed_action], getattr(
                        package, action2field[reversed_action]) - 1)

        base_package = ModelPackage.from_name(update_package.name)
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
            toggle_like_dislike(user_id, Action.LIKE, package)
        if update_mask.has('dislike_count'):
            toggle_like_dislike(user_id, Action.DISLIKE, package)

        # Delete image resources
        if update_mask.has('image_urls'):
            for image_url_to_delete in set(base_package.image_urls) - set(update_package.image_urls):
                try:
                    image = Image.from_url(image_url_to_delete)
                    image.delete()
                except Exception as err:
                    logger.error(
                        f'Failed to delete {image_url_to_delete}: {err}')

        is_visitor = True if set(update_mask.paths) <= {
            'like_count', 'dislike_count'} else False
        if is_visitor:
            package.update(update_update_time=False)
        else:
            package.update(user_id=user_id)

        # notify all subscribers
        author = ModelUser.from_name(f'users/{package.author_id}')
        view = ResourceViewVisitor().visit(package)
        if on_approve(base_package.state, update_package.state):
            for sub in ModelLegacySubscription.list(ListOptions(parent=author.name))[0]:
                notify(
                    sender_id=author.user_id,
                    receiver_id=sub.subscriber_id,
                    content=f'{author.username} 发布了 {view.display_name}',
                    link=view.name,
                    image_preview=view.image_url,
                )
        return package

    def delete(self, name: str, handler_context: HandlerContext) -> ModelPackage:
        package = ModelPackage.from_name(name)
        for image_url in package.image_urls:
            try:
                Image.from_url(image_url).delete()
            except Exception:
                logger.error(f'Failed to delete image: image_url={image_url}')

        for binary in ModelBinary.list(ListOptions(parent=package.name))[0]:
            try:
                binary.delete(user_id=handler_context.user.user_id)
            except Exception as err:
                logger.error(
                    f'Failed to delete binary: binary={binary} err={err}')

        for thread in ModelThread.list(ListOptions(parent=package.name))[0]:
            try:
                thread.delete(user_id=handler_context.user.user_id)
            except Exception as err:
                logger.error(f'Failed to delete {thread} under {self}: {err}')

        get_file_server(FileServerType.GCS).delete_folder(
            BucketClass.REGULAR, package.name)
        get_file_server(FileServerType.S3).delete_folder(
            BucketClass.REGULAR, package.name)
        package.delete(user_id=handler_context.user.user_id)
        return package

    def search_packages(self, request, context):
        # (TODO): Reimplement this with ModelPackage
        # packages, next_page_token = ModelPackage.list(list_options=ListOptions(
        #     parent=None,
        #     filter=request.query,
        # ))
        return pb.SearchPackagesResponse()
