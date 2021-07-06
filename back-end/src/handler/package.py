import sys, os
import logging


from .lib.protos import san11_platform_pb2
from .lib.auths import Authenticator
from .lib.package import Package, Status
from .lib.image import Image
from .lib.exception import PermissionDenied
from .lib.field_mask import FieldMask, merge_resource


logger = logging.getLogger(os.path.basename(__file__))


class PackageHandler:
    def create_package(self, request, context):
        auth = Authenticator.from_context(context)
        package = Package.from_pb(request.package)
        package.author_id = auth.session.user.user_id
        package.create(user_id=auth.session.user.user_id)
        return package.to_pb()

    def delete_package(self, request, context):
        package = Package.from_id(request.package.package_id)

        auth = Authenticator.from_context(context)
        if not auth.canDeletePackage(package):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)

        package.delete(user_id=auth.session.user.user_id)
        logger.info(f'Package is deleted: {package}')

        return san11_platform_pb2.Empty()

    def get_package(self, request, context):
        return Package.from_id(request.package_id).to_pb()

    def list_packages(self, request, context):
        try:
            user = Authenticator.from_context(context=context).session.user
        except Exception:
            user = None
        logger.debug(
            f"ListPackage: user={user.username if user else 'visitor'}")

        return san11_platform_pb2.ListPackagesResponse(packages=[
            package.to_pb()
            for package in Package.list(0, '',
                                        category_id=request.category_id,
                                        author_id=request.author_id,
                                        tag_id=request.tag_id
                                        ) if package.status == Status.NORMAL or
            (user and user.user_id == package.author_id and package.status in [Status.UNDER_REVIEW, Status.HIDDEN]) or
            (user and user.user_type == 'admin')
            # package's status is normal or user is admin or author of the package
        ])

    def search_packages(self, request, context):
        logger.info(f'In SearchPackage: query={request.query}')
        return san11_platform_pb2.SearchPackagesResponse(
            packages=[package.to_pb() for package in Package.search(request.page_size,
                                                                    request.page_token, 
                                                                    request.query)])

    def update_package(self, request, context):
        logger.debug(request.package.image_urls)
        base_package = Package.from_id(request.package.package_id)

        auth = Authenticator.from_context(context)
        if not auth.canUpdatePackage(base_package):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)

        # patch update_mask as Package store tag_ids internal while tags is used
        # for public protos
        update_mask = FieldMask.from_pb(request.update_mask)
        if 'tags' in update_mask.paths:
            update_mask.paths.remove('tags')
            update_mask.paths.add('tag_ids')
        package = merge_resource(base_resource=base_package,
                                 update_request=Package.from_pb(request.package),
                                 field_mask=update_mask)
        # Delete image resources
        for image_url_to_delete in set(base_package.image_urls) - set(package.image_urls):
            try:
                image = Image.from_url(image_url_to_delete)
                image.delete()
            except Exception as err:
                logger.error(f'Failed to delete {image_url_to_delete}: {err}')
        package.update(user_id=auth.session.user.user_id)
        return package.to_pb()
