import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.url import Url
from lib.auths import Authenticator, Session
from lib.image import Image
from lib.package import Package
from lib.user import User 
from lib.exception import Unauthenticated, PermissionDenied, InvalidArgument
from lib.field_mask import FieldMask, merge_resource


logger = logging.getLogger(os.path.basename(__file__))


class UserHandler:
    def sign_up(self, request, context):
        logger.info(f'In sign_up')
        try:
            user = User.from_pb(request.user)
            user.create(request.password)
        except ValueError as err:
            context.abort(code=255, details=str(err))

        session = Session.create(user.user_id)
        resp = san11_platform_pb2.SignUpResponse(
            user=user.to_pb(),
            sid=session.sid)
        logger.info(f'user is created: resp={resp}')
        return resp

    def sign_in(self, request, context):
        logger.info('In sign_in')

        try:
            user = User.from_name(request.username)
            user.validate(request.password)
        except LookupError:
            context.abort(code=InvalidArgument.code, details=f'{InvalidArgument.message}: 用户名不存在')
        except Unauthenticated:
            context.abort(code=InvalidArgument.code, details=f'{InvalidArgument.message}: 用户名,密码 不匹配')

        try:
            session = Session.from_user_id(user.user_id)
        except LookupError:
            session = Session.create(user.user_id)
        else:
            session.extend()

        logger.info(f'Login: user_id={user.user_id} sid={session.sid}')
        return san11_platform_pb2.SignInResponse(user=user.to_pb(),
                                                 sid=session.sid)
                                                
    def sign_out(self, request, context):
        logger.info(f'In sign_out: user_id={request.user_id}')
        return san11_platform_pb2.Status(code=0, message="登出成功")
    
    def update_user(self, request, context):
        logger.info(f'In update_user: user_id={request.user.user_id}')
        base_user = User.from_id(request.user.user_id)

        authenticate = Authenticator.from_context(context)
        if not authenticate.canUpdateUser(user=base_user):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)

        user = merge_resource(base_resource=base_user,
                                update_request=User.from_pb(request.user),
                                field_mask=FieldMask.from_pb(request.update_mask))
        if not user.image_url and base_user.image_url:
            try:
                Image.from_url(base_user.image_url).delete()
            except Exception as err:
                logger.error(f'Failed to delete {base_user.image_url}: {err}')
        if user.username != base_user.username:
            User.validate_username(user.username)
        if user.email != base_user.email:
            User.validate_email(user.email)
        user.update()
        return user.to_pb()

    def update_password(self, request, context):
        logger.info(f'In update_password: user_id={request.user_id}')
        user = User.from_id(request.user_id)

        authenticate = Authenticator.from_context(context)
        if not authenticate.canUpdateUser(user=user):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)

        user.set_password(request.password)
        return san11_platform_pb2.Empty()
    
    def get_user(self, request, context):
        # logger.info(f'In get_user: user_id={request.user_id}')
        try:
            user = User.from_id(request.user_id)
        except LookupError:
            logger.info(f'GetUser: user_id={request.user_id} does not exist')
            context.abort(code=InvalidArgument.code, details=f'{InvalidArgument.message}: 用户不存在')
        return user.to_pb()

    def list_users(self, request, context):
        logger.info(f'In list_users')
        Authenticator.from_context(context)
        return san11_platform_pb2.ListUsersResponse(users=[
            user.to_pb() for user in User.list(0, '')
        ])