import sys, os, uuid, logging

from .lib.protos import san11_platform_pb2
from .lib.url import Url
from .lib.auths import Authenticator, Session
from .lib.image import Image
from .lib.package import Package
from .lib.user import User, generate_verification_code, verify_code
from .lib.exception import Unauthenticated, PermissionDenied, InvalidArgument, AlreadyExists
from .lib.field_mask import FieldMask, merge_resource
from .lib.notifier import Notifier
from .lib.db.db_util import run_sql_with_param


logger = logging.getLogger(os.path.basename(__file__))


class UserHandler:
    def sign_up(self, request, context):
        try:
            user = User.from_pb(request.user)
            assert verify_code(user.email, request.verification_code), '邮箱未经验证'
            User.validate_username(user.username)
            User.validate_email(user.email)
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
        return san11_platform_pb2.Status(code=0, message="登出成功")
    
    def update_user(self, request, context):
        base_user = User.from_id(request.user.user_id)

        auth = Authenticator.from_context(context)
        if not auth.canUpdateUser(user=base_user):
            context.abort(code=PermissionDenied.code, details=PermissionDenied.message)

        update_mask = FieldMask.from_pb(request.update_mask)
        user = merge_resource(base_resource=base_user,
                                update_request=User.from_pb(request.user),
                                field_mask=update_mask)
        if not user.image_url and base_user.image_url:
            try:
                Image.from_url(base_user.image_url).delete()
            except Exception as err:
                logger.error(f'Failed to delete {base_user.image_url}: {err}')
        if user.username != base_user.username:
            User.validate_username(user.username)
        if user.email != base_user.email:
            User.validate_email(user.email)
        user.update(user_id=auth.session.user.user_id)
        return user.to_pb()

    def update_password(self, request, context):
        user = User.from_id(request.user_id)

        if request.verification_code:
            if not verify_code(user.email, request.verification_code):
                context.abort(code=PermissionDenied.code, details='验证码不正确')
        else:
            authenticate = Authenticator.from_context(context)
            if not authenticate.canUpdateUser(user=user):
                context.abort(code=PermissionDenied.code, details=PermissionDenied.message)

        user.set_password(request.password)
        return san11_platform_pb2.Empty()

    def get_user(self, request, context):
        try:
            if request.HasField('user_id'):
                user = User.from_id(request.user_id)
            elif request.HasField('username'):
                user = User.from_name(request.username)
        except LookupError:
            logger.info(f'GetUser: user_id={request.user_id} does not exist')
            context.abort(code=InvalidArgument.code, details=f'{InvalidArgument.message}: 用户不存在')
        return user.to_pb()

    def list_users(self, request, context):
        Authenticator.from_context(context)
        return san11_platform_pb2.ListUsersResponse(users=[
            user.to_pb() for user in User.list(0, '')
        ])

    def send_verification_code(self, request, context):
        logger.info('In send_verfication_code')
        email = request.email
        verification_code = generate_verification_code(email)
        Notifier().send_email(email, '新注册用户的验证码', verification_code)
        return san11_platform_pb2.Empty()

    def verify_email(self, request, context):
        email, code = request.email, request.verification_code
        return san11_platform_pb2.VerifyEmailResponse(ok=verify_code(email, code))
        
    def verify_new_user(self, request, context):
        if request.HasField('username'):
            try:
                User.validate_username(request.username)
            except AlreadyExists as err:
                return san11_platform_pb2.Status(code=err.code, message='已被使用')
        elif request.HasField('password'):
            ...
        elif request.HasField('email'):
            try:
                User.validate_email(request.email)
            except ValueError:
                return san11_platform_pb2.Status(code=InvalidArgument.code, message='格式不正确')
            except AlreadyExists as err:
                return san11_platform_pb2.Status(code=err.code, message='已被使用')
        return san11_platform_pb2.Status(code=0, message = '')