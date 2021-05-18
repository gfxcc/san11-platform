import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.auths import Authenticator
from lib.package import Package, Status
from lib.image import Image
from lib.exception import PermissionDenied
from lib.field_mask import FieldMask, merge_resource


logger = logging.getLogger(os.path.basename(__file__))


class PackageHandler:
    def create_package(self, request, context):
        logger.info('In CreatePackage')
        authenticator = Authenticator.from_context(context)
        package = Package.from_pb(request.package)
        package.author_id = authenticator.session.user.user_id
        logger.debug(package.create_time)
        package.create()
        return package.to_pb()

    def delete_package(self, request, context):
        logger.info(
            f'In DeletePackage: package_id={request.package.package_id}')
        package = Package.from_id(request.package.package_id)

        authenticator = Authenticator.from_context(context)
        if not authenticator.canDeletePackage(package):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)

        package.delete()
        logger.info(f'Package is deleted: {package}')

        return san11_platform_pb2.Empty()

    def get_package(self, request, context):
        logger.info(f'In GetPackage: package_id={request.package_id}')
        return Package.from_id(request.package_id).to_pb()

    def list_packages(self, request, context):
        logger.info(f'In ListPackages: category_id={request.category_id}')
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
        logger.info(
            f'In UpdatePackage: package_id={request.package.package_id}')
        logger.debug(request.package.image_urls)
        base_package = Package.from_id(request.package.package_id)

        authenticate = Authenticator.from_context(context)
        if not authenticate.canUpdatePackage(base_package):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)

        # patch update_mask as Package store tag_ids internal while tags is used
        # for public protos
        update_mask = FieldMask.from_pb(request.update_mask)
        if 'tags' in update_mask.paths:
            update_mask.paths.remove('tags')
            update_mask.paths.append('tag_ids')
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
        package.update()
        return package.to_pb()
