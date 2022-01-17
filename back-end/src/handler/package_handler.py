import logging
import os
from typing import Iterable, Tuple

from handler.model.base.base_db import ListOptions
from handler.model.model_binary import ModelBinary
from handler.model.model_package import ModelPackage
from handler.model.model_thread import ModelThread

from .auths import Authenticator
from .common.exception import PermissionDenied
from .common.field_mask import FieldMask, merge_resource
from .common.image import Image
from .model.package import Package, Status
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
                    admin.email, '新工具待审核', f'[{package.package_name}] 已被 {user.username} 创建。请审核。')
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
        list_options.filter = ''
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
            packages = filter(lambda x: handler_context.user.user_type == 'admin' or
                              x.state == pb.ResourceState.NORMAL or
                              (x.author_id == handler_context.user.user_id and
                               x.state in [pb.ResourceState.HIDDEN,
                                           pb.ResourceState.UNDER_REVIEW]),
                              packages)
        return packages, next_page_token

    def delete_package(self, request, context):
        package = Package.from_id(request.package.package_id)

        auth = Authenticator.from_context(context)
        if not auth.canDeletePackage(package):
            context.abort(code=PermissionDenied().code,
                          details=PermissionDenied().message)

        for image_url in package.image_urls:
            try:
                Image.from_url(image_url).delete()
            except Exception:
                logger.error(f'Failed to delete image: image_url={image_url}')

        for binary in ModelBinary.list(ListOptions(parent=package.name))[0]:
            try:
                binary.delete(user_id=auth.session.user.user_id)
            except Exception as err:
                logger.error(
                    f'Failed to delete binary: binary={binary} err={err}')

        for thread in ModelThread.list(ListOptions(parent=package.name))[0]:
            try:
                thread.delete(user_id=auth.session.user.user_id)
            except Exception as err:
                logger.error(f'Failed to delete {thread} under {self}: {err}')

        package.delete(user_id=auth.session.user.user_id)
        logger.info(f'Package is deleted: {package}')

        return pb.Empty()

    def search_packages(self, request, context):
        return pb.SearchPackagesResponse(
            packages=[package.to_pb() for package in Package.search(request.page_size,
                                                                    request.page_token,
                                                                    request.query)])

    def update_package(self, base_package: ModelPackage, update_package: ModelPackage, update_mask: FieldMask, handler_context):
        # Delete image resources
        for image_url_to_delete in set(base_package.image_urls) - set(update_package.image_urls):
            try:
                image = Image.from_url(image_url_to_delete)
                image.delete()
            except Exception as err:
                logger.error(f'Failed to delete {image_url_to_delete}: {err}')

        package: ModelPackage = merge_resource(
            base_package, update_package, update_mask)
        package.update(handler_context.user.user_id)
        return package
