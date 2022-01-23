import logging
import os
from typing import Iterable, Tuple

import grpc

from handler.model.base.base_db import ListOptions
from handler.model.model_user import (ModelUser, validate_email,
                                      validate_password, validate_username)

from .auths import Session
from .common.exception import (AlreadyExists, InvalidArgument, NotFound,
                               Unauthenticated)
from .common.field_mask import FieldMask, merge_resource
from .common.image import Image
from .model.user import User, generate_verification_code, verify_code
from .protos import san11_platform_pb2
from .util.notifier import Notifier

logger = logging.getLogger(os.path.basename(__file__))


class UserHandler:
    def create_user(self, parent: str, user: ModelUser,
                    handler_context) -> Tuple[ModelUser, Session]:
        validate_email(user.email)
        validate_username(user.username)
        validate_password(user.password)

        user.create(parent, user.user_id)
        session = Session.create(user.user_id)
        return user, session

    def get_user(self, name: str, handler_context) -> ModelUser:
        user = ModelUser.from_name(name)
        return user

    def list_users(self, request, handler_context) -> Tuple[Iterable[ModelUser], str]:
        list_options = ListOptions.from_request(request)
        users, next_page_token = ModelUser.list(list_options)
        return users, next_page_token

    def update_user(self, base_user: ModelUser, update_user: ModelUser,
                    update_mask: FieldMask, handler_context) -> ModelUser:
        user: ModelUser = merge_resource(
            base_user, update_user, update_mask)
        user.update(handler_context.user.user_id)
        return user

    def sign_in(self, user: ModelUser, password: str, handler_context):
        if user.name:
            user = ModelUser.from_name(user.name)
        elif user.email:
            users = ModelUser.list(ListOptions(
                parent='', filter=f'email=\"{user.email}\"'))[0]
            if not users:
                raise NotFound(message='用户不存在')
            user = users[0]
        else:
            raise NotFound(message='用户不存在')

        if user.password != password:
            raise Unauthenticated(message='用户名,密码 不匹配')

        try:
            session = Session.from_user_id(user.user_id)
        except NotFound:
            session = Session.create(user.user_id)
        else:
            session.extend()

        logger.info(f'Login: user_id={user.user_id} sid={session.sid}')
        return san11_platform_pb2.SignInResponse(user=user.to_pb(),
                                                 sid=session.sid)

    def sign_out(self, request, context):
        ...

    def update_user(self, base_user: ModelUser, update_user: ModelUser,
                    update_mask: FieldMask, handler_context) -> ModelUser:
        user = merge_resource(base_user,
                              update_user,
                              update_mask)
        if user.image_url != base_user.image_url:
            if base_user.image_url:
                try:
                    Image.from_url(base_user.image_url).delete()
                except Exception as err:
                    logger.error(
                        f'Failed to delete {base_user.image_url}: {err}')
        if user.username != base_user.username:
            validate_username(user.username)
        if user.email != base_user.email:
            validate_email(user.email)
        if user.password != base_user.password:
            validate_password(user.password)
        user.update(user_id=user.user_id)
        return user

    def list_users(self, request, context):
        # (TODO): Consider bucket user fields into different sections
        # and only populate certain section with permission check.
        # E.g. public_section, private_section, admin_section, ...
        list_options = ListOptions.from_request(request)
        users, next_page_token = ModelUser.list(list_options)
        return users, next_page_token

    def send_verification_code(self, email: str, handler_context) -> None:
        verification_code = generate_verification_code(email)
        Notifier().send_email(email, '账号验证码', verification_code)

    def verify_email(self, email: str, verification_code: str, context):
        try:
            user = User.from_email(email)
        except LookupError:
            return context.abort(NotFound().code, f'该邮箱未注册')
        return san11_platform_pb2.VerifyEmailResponse(ok=verify_code(email, code), user_id=user.user_id)

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
            except InvalidArgument as e:
                return san11_platform_pb2.Status(code=e.code, message=e.message)
            except AlreadyExists as err:
                return san11_platform_pb2.Status(code=err.code, message='已被使用')
        return san11_platform_pb2.Status(code=0, message='')
