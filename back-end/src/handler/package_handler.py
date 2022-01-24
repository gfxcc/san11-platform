import logging
import os
from typing import Iterable, Tuple

from handler.model.activity import Action
from handler.model.base import FieldMask, merge_resource
from handler.model.base.base_db import ListOptions
from handler.model.model_activity import ModelActivity, search_activity
from handler.model.model_binary import ModelBinary
from handler.model.model_package import ModelPackage
from handler.model.model_thread import ModelThread
from handler.util.time_util import get_now

from .common.image import Image
from .model.user import User
from .protos import san11_platform_pb2 as pb
from .util.notifier import Notifier

logger = logging.getLogger(os.path.basename(__file__))


class PackageHandler:
    def create_package(self, parent: str, package: ModelPackage, handler_context):
        package.author_id = handler_context.user.user_id
        package.state = pb.ResourceState.UNDER_REVIEW
        package.create(parent=parent, user_id=handler_context.user.user_id)
        try:
            notifer = Notifier()
            for admin in User.list(0, '', user_type='admin'):
                notifer.send_email(
                    admin.email, '新工具待审核', f'[{package.package_name}] 已被 {admin.username} 创建。请审核。')
        except Exception as err:
            logger.error(f'Failed to notify admin: {err}')
        return package

    def get_package(self, name: str, handler_content) -> ModelPackage:
        return ModelPackage.from_name(name)

    def list_packages(self, request, handler_context) -> Tuple[Iterable[ModelPackage], str]:
        # (TODO): BEGIN - Remove logic for model migration
        # if not ModelPackage.list(ListOptions(parent='categories/1'))[0]:
        #     for package in Package.list(page_size=1000, page_token=''):
        #         new_model = ModelPackage.from_v1(package)
        #         new_model.backfill()
        # - END
        list_options = ListOptions.from_request(request)
        # (TODO): Due to ListOptions.filter does not support `OR` operation, we
        # will do list without any filter and hide content later manually.
        # This should be replaced with different `filter` expression later when
        # possible.
        packages, next_page_token = ModelPackage.list(list_options)
        if handler_context.user is None:
            # Most users (including anonymous users) should only see packages in
            # `NORMAL` state.
            packages = filter(lambda x: x.state in [
                              pb.ResourceState.NORMAL], packages)
        else:
            # Admin user can see all packages.
            # Users who also publish packages will also see packages they published
            # in `HIDDEN`, `UNDER_REVIEW` state.
            packages = filter(lambda x: handler_context.user.type == pb.User.UserType.ADMIN or
                              x.state == pb.ResourceState.NORMAL or
                              (x.author_id == handler_context.user.user_id and
                               x.state in [pb.ResourceState.HIDDEN,
                                           pb.ResourceState.UNDER_REVIEW]),
                              packages)
        return packages, next_page_token

    def delete_package(self, package: ModelPackage, handler_context):
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

        package.delete(user_id=handler_context.user.user_id)
        return package

    def search_packages(self, request, context):
        # (TODO): Reimplement this with ModelPackage
        return pb.SearchPackagesResponse()

    def update_package(self, base_package: ModelPackage,
                       update_package: ModelPackage,
                       update_mask: FieldMask,
                       handler_context):
        # Remove `like_count`, `dislike_count` from update_mask here and handle the count update
        #   explicitly later.
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'like_count', 'dislike_count'})
        package = merge_resource(base_resource=base_package,
                                 update_request=update_package,
                                 field_mask=sanitized_update_mask)
        user_id = handler_context.user.user_id

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
                ModelActivity(name='', create_time=get_now(),
                              action=action.value, resource_name=package.name).create(parent=f'users/{user_id}')
                setattr(package, action2field[action], getattr(
                    package, action2field[action]) + 1)

                reversed_action = Action.DISLIKE if action == Action.LIKE else Action.LIKE
                act2 = search_activity(
                    f'users/{user_id}', reversed_action, package.name)
                if act2:
                    act2.delete()
                    setattr(package, action2field[reversed_action], getattr(
                        package, action2field[reversed_action]) - 1)

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
            package.update(user_id)
        return package
