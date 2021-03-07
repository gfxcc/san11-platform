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


logger = logging.getLogger(os.path.basename(__file__))


def get_sid_from_context(context) -> str:
    return dict(context.invocation_metadata())['sid']


class RouteGuideServicer(san11_platform_pb2_grpc.RouteGuideServicer):
    """Provides methods that implement functionality of route guide server."""

    def __init__(self):
        pass

    def ListPackages(self, request, context):
        logger.info('In ListPackages')
        try:
            user = User.from_user_id(Session.from_sid(get_sid_from_context(context)).user_id)
        except Exception:
            user = None
        logger.debug(f"ListPackage: user={user.username if user else 'visitor'}")

        return san11_platform_pb2.ListPackagesResponse(packages=[
            package.to_pb()
            for package in Package.list_packages(
                request.primary_category,
                request.secondary_category
            ) if package.status == 'normal' or
            (user and (user.user_type == 'admin' or
                       user.user_id == package.author_id))
            # package's status is normal or user is admin or author of the package
        ])

    def CreatePackage(self, request, context):
        logger.info('In CreatePackage')
        try:
            user_id = Session.from_sid(get_sid_from_context(context)).user_id
        except Exception as err:
            logger.info(f'User need to login to create package:{err}')
            context.abort(code=255, details='Please login')
            raise

        package = Package.create(
            name=request.package.name,
            description=request.package.description,
            primary_category=request.package.primary_category,
            secondary_category=request.package.secondary_category,
            status='under_review',
            author_id=user_id,
            binary_ids=list(request.package.binary_ids),
            image_ids=list(request.package.image_ids)
        )

        logger.info(f'{package} is created')
        return package.to_pb()
    
    def DeletePackage(self, request, context):
        logger.info(f'In DeletePackage: package_id={request.package.package_id}')
        try:
            user = User.from_user_id(Session.from_sid(get_sid_from_context(context)).user_id)
        except Exception as err:
            logger.info(f'User need to login to create package:{err}')
            context.abort(code=255, details='请登录')

        package = Package.from_package_id(request.package.package_id)
        if not (user.user_type == 'admin' or user.user_id == package.author_id):
            context.abort(code=255, details='只有 工具作者 或 管理员 可以删除工具')
        
        package.delete()
        logger.info(f'Package is deleted: {package}')
        return san11_platform_pb2.Empty()
    
    def UpdatePackage(self, request, context):
        logger.info(f'In UpdatePackage: package_id={request.package.package_id}')

        package = Package.from_package_id(request.package.package_id)
        if request.package.name:
            package.name = request.package.name
        if request.package.description:
            package.description = request.package.description
        if request.package.status:
            package.status = request.package.status
        if request.package.binary_ids:
            package.binary_ids = request.package.binary_ids
        if request.package.image_ids:
            package.image_ids = request.package.image_ids

        package.update()
        return package.to_pb()

    # binaries
    def GetBinary(self, request, context):
        logger.info(f'In GetBinary: binary_id={request.binary_id}')
        binary = Binary.from_binary_id(request.binary_id)
        return binary.download()

    def UploadBinary(self, request, context):
        logger.info(f'In UploadBinary: parent={request.parent}')
        package_id = int(request.parent.split('/')[1])
        
        binary = Binary.from_pb(request.binary)
        binary.persist()

        Package.from_package_id(package_id).append_binary(binary)
        return san11_platform_pb2.Status(code=0, message='上传成功')

    # images
    def GetImage(self, request, context):
        logger.info(f'In GetImage: image_id={request.image_id}')
        try:
            image = Image.from_image_id(request.image_id)
        except Exception as err:
            logger.error(f'Failed to load image: image_id={request.image_id} err={err}')
            image = Image.san11_default()
        return image.to_pb()

    def UploadImage(self, request, context):
        logger.info(f'In UploadImage: parent={request.parent}')
        parent_type, parent_id = request.parent.split('/')
        image = Image.create(request.image)

        if parent_type == 'packages':
            Package.from_package_id(parent_id).append_image(image)
        elif parent_type == 'users':
            User.from_user_id(parent_id).set_image(image)
        else:
            raise Exception(f'Invalid parent_type: {parent_type}')

        return san11_platform_pb2.Status(code=0, message="上传成功")

    def ListImages(self, request, context):
        return san11_platform_pb2.ListImagesResponse(
            images=[Image.from_image_id(image_id).to_pb()
                    for image_id in request.image_ids]
        )

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

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    san11_platform_pb2_grpc.add_RouteGuideServicer_to_server(
        RouteGuideServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    logging.info('Server started...')
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig(level=logging.NOTSET)
    serve()
