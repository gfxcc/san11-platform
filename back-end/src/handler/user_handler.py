import logging
import os
from typing import Iterable, List, Optional, Tuple, Type

from handler.auths import session
from handler.handler_context import HandlerContext
from handler.model.base import (FieldMask, HandlerBase, ModelBase,
                                merge_resource)
from handler.model.base.base_db import ListOptions
from handler.model.model_user import (ModelUser, get_user_by_email,
                                      validate_email, validate_new_user,
                                      validate_password, validate_username)
from handler.protos import san11_platform_pb2 as pb
from handler.util.user_util import (hash_password, normalize_email,
                                    verify_password)

from .auths import Session
from .common.exception import (AlreadyExists, InvalidArgument, NotFound,
                               PermissionDenied, Unauthenticated)
from .common.image import Image
from .model.user import User, generate_verification_code, verify_code
from .protos import san11_platform_pb2
from .util.notifier import Notifier

logger = logging.getLogger(os.path.basename(__file__))


class UserHandler(HandlerBase):
    def create_user(self, parent: str, user: ModelUser,
                    handler_context: HandlerContext) -> Tuple[ModelUser, Session]:
        user = self.create(parent, user, handler_context)
        session = Session.create(user.user_id)
        return user, session

    def create(self, parent: str, user: ModelUser,
               handler_context: HandlerContext) -> ModelUser:
        user.image_url = 'users/default_avatar.jpg'
        validate_new_user(user)
        user.create(parent)
        return user

    def get(self, name: str, handler_context) -> ModelBase:
        user = ModelUser.from_name(name=name)
        return user

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelUser], str]:
        # (TODO): Consider bucket user fields into different sections
        # and only populate certain section with permission check.
        # E.g. public_section, private_section, admin_section, ...
        users, next_page_token = ModelUser.list(list_options)
        return users, next_page_token

    def update(self, update_resource: ModelUser, update_mask: FieldMask, handler_context: HandlerContext) -> ModelUser:
        base_user = ModelUser.from_name(update_resource.name)
        user: ModelUser = merge_resource(
            base_user, update_resource, update_mask)
        if user.image_url != base_user.image_url:
            if base_user.image_url:
                try:
                    img = Image.from_url(base_user.image_url)
                    if img.url != 'users/default_avatar.jpg':
                        img.delete()
                except Exception as err:
                    logger.error(
                        f'Failed to delete {base_user.image_url}: {err}')
        if user.username != base_user.username:
            validate_username(user.username)
        if user.email != base_user.email:
            validate_email(user.email)
        user.update(user_id=user.user_id)
        return user

    def sign_in(self, user: ModelUser, password: str, handler_context: HandlerContext) -> Tuple[ModelUser, str]:
        if not verify_password(password, user.hashed_password):
            raise Unauthenticated(message='用户名,密码 不匹配')

        try:
            session = Session.from_user_id(user.user_id)
        except NotFound:
            session = Session.create(user.user_id)
        else:
            session.extend()

        logger.info(f'Login: user_id={user.user_id} sid={session.sid}')
        return user, session.sid

    def sign_out(self, request, context):
        ...

    def send_verification_code(self, email: str, handler_context: HandlerContext) -> None:
        verification_code = generate_verification_code(email)
        Notifier().send_email(email, '账号验证码', verification_code)

    def verify_email(self, email: str, verification_code: str, context) -> Tuple[bool, Optional[ModelUser]]:
        if not verify_code(email, verification_code):
            raise Unauthenticated(message='验证码不正确')
        try:
            user = get_user_by_email(email)
        except NotFound:
            user = None
        return True, user
