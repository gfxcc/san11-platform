import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.auths import Authenticator
from lib.package import Package
from lib.image import Image


logger = logging.getLogger(os.path.basename(__file__))


class PackageHandler:
    def create_package(self, request, context):
        logger.info('In CreatePackage')
        authenticator = Authenticator.from_context(context)
        package = Package.from_pb(request.package)
        package.author_id = authenticator.session.user.user_id
        package.create()
        return package.to_pb()

    def delete_package(self, request, context):
        logger.info(
            f'In DeletePackage: package_id={request.package.package_id}')
        package = Package.from_id(request.package.package_id)

        authenticator = Authenticator.from_context(context)
        if not authenticator.canDeletePackage(package):
            context.abort(code=255, details='权限不足')

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
                                        ) if package.status == 'normal' or
            (user and user.user_id == package.author_id and package.status != 'hidden') or
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
        package = Package.from_id(request.package.package_id)

        authenticate = Authenticator.from_context(context)
        if not authenticate.canUpdatePackage(package):
            context.abort(code=255, details='权限不足')

        if request.package.name:
            package.name = request.package.name
        if request.package.description:
            package.description = request.package.description
        if request.package.status:
            package.status = request.package.status
        if request.package.image_urls or request.package.image_urls == ['empty']:
            updated_image_urls = set() if request.package.image_urls == [
                'empty'] else set(request.package.image_urls)
            for image_to_remove in set(package.image_urls) - updated_image_urls:
                try:
                    image = Image.from_url(image_to_remove)
                    image.delete()
                    logger.info(f'Image is deleted: {image}')
                except Exception as err:
                    logger.error(f'Failed to delete image: {err}')
            logger.debug(request.package.image_urls)
            package.image_urls = list(updated_image_urls)
        if request.package.tags:
            package.tag_ids = [] if request.package.tags[0].tag_id == 0 else list(
                set(tag.tag_id for tag in request.package.tags))
        package.update()
        return package.to_pb()
