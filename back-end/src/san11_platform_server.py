import os
import time
import logging
import sys
import re
import grpc

from typing import List
from concurrent import futures


import lib.db_util as db_util

from lib.protos import san11_platform_pb2
from lib.protos import san11_platform_pb2_grpc
from lib.session import Session
from lib.user import User, InvalidPassword
from lib.image import Image
from lib.package import Package
from lib.binary import Binary
from lib.url import Url
from lib.statistic import Statistic
from lib.query import Query


logger = logging.getLogger(os.path.basename(__file__))


def get_sid_from_context(context) -> str:
    return dict(context.invocation_metadata())['sid']


class RouteGuideServicer(san11_platform_pb2_grpc.RouteGuideServicer):
    """Provides methods that implement functionality of route guide server."""

    def __init__(self):
        pass

    def CreatePackage(self, request, context):
        logger.info('In CreatePackage')
        try:
            user_id = Session.from_sid(get_sid_from_context(context)).user_id
        except Exception as err:
            logger.info(f'User need to login to create package:{err}')
            context.abort(code=255, details='Please login')
            raise

        package = Package.create_from_pb(request.package, user_id)

        logger.info(f'{package} is created')
        return package.to_pb()

    def DeletePackage(self, request, context):
        logger.info(
            f'In DeletePackage: package_id={request.package.package_id}')
        try:
            user = User.from_user_id(Session.from_sid(
                get_sid_from_context(context)).user_id)
        except Exception as err:
            logger.info(f'User need to login to create package:{err}')
            context.abort(code=255, details='请登录')

        package = Package.from_package_id(request.package.package_id)
        if not (user.user_type == 'admin' or user.user_id == package.author_id):
            context.abort(code=255, details='只有 工具作者 或 管理员 可以删除工具')

        package.delete()
        logger.info(f'Package is deleted: {package}')

        return san11_platform_pb2.Empty()

    def GetPackage(self, request, context):
        logger.info(f'In GetPackage: package_id={request.package_id}')
        return Package.from_package_id(request.package_id).to_pb()

    def ListPackages(self, request, context):
        logger.info(f'In ListPackages: category_id={request.category_id}')
        try:
            user = User.from_user_id(Session.from_sid(
                get_sid_from_context(context)).user_id)
        except Exception:
            user = None
        logger.debug(
            f"ListPackage: user={user.username if user else 'visitor'}")

        Statistic.load_today().increment_visit()

        return san11_platform_pb2.ListPackagesResponse(packages=[
            package.to_pb()
            for package in Package.list_packages(
                request.category_id
            ) if package.status == 'normal' or
            (user and user.user_id == package.author_id and package.status != 'deleted') or
            (user and user.user_type == 'admin')
            # package's status is normal or user is admin or author of the package
        ])

    def SearchPackages(self, request, context):
        logger.info(f'In SearchPackage: query={request.query}')
        return san11_platform_pb2.SearchPackagesResponse(packages=[package.to_pb() for package in Package.search(Query.from_str(request.query))])

    def UpdatePackage(self, request, context):
        logger.info(
            f'In UpdatePackage: package_id={request.package.package_id}')
        logger.debug(request.package.image_urls)

        package = Package.from_package_id(request.package.package_id)
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

        package.update()
        return package.to_pb()

    # binaries
    def DownloadBinary(self, request, context):
        logger.info(f'In DownloadBinary: binary_id={request.binary_id}')
        binary = Binary.from_binary_id(request.binary_id)
        binary.download()
        logger.debug(f'{binary} is downloaded')

        # website statistic
        Statistic.load_today().increment_download()
        # Package statistic
        Package.from_package_id(Url(request.parent).id).increment_download()
        return binary.to_pb()

    def UploadBinary(self, request, context):
        logger.info(f'In UploadBinary: parent={request.parent}')
        parent = Url(request.parent)

        binary = Binary.createc_under_parent(
            request.parent, request.binary, request.data)

        return san11_platform_pb2.Status(code=0, message='上传成功')

    def getBinary(self, request, context):
        logger.info(f'In GetBinary: binary_id={request.binary_id}')
        binary = Binary.from_binary_id(request.binary_id)
        return binary.to_pb()

    def ListBinaries(self, request, context):
        logger.info(f'In ListBinaries: package_id: {request.package_id}')
        return san11_platform_pb2.ListBinariesResponse(binaries=[
            binary.to_pb() for binary in Binary.from_package_id(request.package_id)
        ])

    def DeleteBinary(self, request, context):
        logger.info(f'In DeleteBinary: binary_id={request.binary_id}')
        Binary.from_binary_id(request.binary_id).delete()
        return san11_platform_pb2.Empty()

    # image
    def UploadImage(self, request, context):
        logger.info(f'In UploadImage: parent={request.parent}')
        # e.g. packages/1010
        parent = Url(request.parent)
        image = Image.create_without_filename(request.parent, request.image)

        if parent.type == 'packages':
            Package.from_package_id(parent.id).append_image(image)
        elif parent.type == 'users':
            User.from_user_id(parent.id).set_image(image)
        else:
            raise Exception(f'Invalid parent: {parent}')

        return san11_platform_pb2.Url(url=image.url)

    # users
    def SignIn(self, request, context):
        logger.info('In SignIn')

        try:
            user = User.from_name(request.username)
            user.validate(request.password)
        except LookupError:
            context.abort(code=255, details='用户名不存在')
        except InvalidPassword:
            context.abort(code=255, details='用户名,密码 不匹配')

        try:
            session = Session.from_user_id(user.user_id)
        except LookupError:
            session = Session.create(user.user_id)
        else:
            session.extend()

        logger.info(f'Login: user_id={user.user_id} sid={session.sid}')
        return san11_platform_pb2.SignInResponse(user=user.to_pb(),
                                                 sid=session.sid)

    def SignOut(self, request, context):
        logger.info(f'In SignOut: user_id={request.user_id}')
        Session.from_user_id(request.user_id).revoke()
        return san11_platform_pb2.Status(code=0, message="登出成功")

    def SignUp(self, request, context):
        try:
            user = User.create(request.user, request.password)
        except ValueError as err:
            context.abort(code=255, details=str(err))

        session = Session.create(user.user_id)
        resp = san11_platform_pb2.SignUpResponse(
            user=user.to_pb(),
            sid=session.sid)
        logger.info(f'user is created: resp={resp}')
        return resp

    def GetUser(self, request, context):
        logger.info(f'In GetUser: user_id={request.user_id}')
        try:
            user = User.from_user_id(request.user_id)
        except LookupError:
            logger.info(f'GetUser: user_id={request.user_id} does not exist')
            context.abort(code=255, details='用户不存在')
        return user.to_pb()

    def UpdateUser(self, request, context):
        logger.info(f'In UpdateUser: user_id={request.user.user_id}')
        logger.debug(f'user.website={request.user.website}')
        user = User.from_user_id(request.user.user_id)
        if request.user.email:
            user.email = request.user.email
        if request.user.website:
            user.website = request.user.website
        if request.user.image_url == 'empty':
            try:
                Image.from_url(user.image_url).delete()
            except Exception as err:
                logger.error(
                    f'Failed to delete image_url={user.image_url}: {err}')
            user.image_url = ''

        user.update()
        return user.to_pb()

    def UpdatePassword(self, request, context):
        logger.info(f'In UpdatePassword: user_id={request.user_id}')
        user = User.from_user_id(request.user_id)
        user.set_password(request.password)
        return san11_platform_pb2.Empty()

    # Statistics
    def GetStatistic(self, request, context):
        logging.info(f'In GetStatistic')
        # TODO hardcoded to today's information for now
        return Statistic.load_today().to_pb()


def serve():
    options = [('grpc.max_receive_message_length', 30 * 1024 * 1024)]  # 30 MB
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10),
                         options=options)
    san11_platform_pb2_grpc.add_RouteGuideServicer_to_server(
        RouteGuideServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    logging.info('Server started...')
    server.wait_for_termination()


def init_log():
    FORMAT = '%(asctime)-15s %(levelname)s %(name)s %(message)s'
    logging.basicConfig(level=logging.NOTSET, format=FORMAT)


if __name__ == '__main__':
    init_log()
    serve()
