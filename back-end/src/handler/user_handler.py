import logging
import os
import uuid
from typing import List, Optional, Tuple

from handler.handler_context import HandlerContext
from handler.model.base import (FieldMask, HandlerBase, ListOptions, ModelBase,
                                merge_resource)
from handler.model.model_user import (DEFAULT_USER_AVATAR, ModelUser,
                                      default_user_settings, get_user_by_email,
                                      validate_email, validate_new_user,
                                      validate_username)
from handler.util.file_server import (BucketClass, FileServer, FileServerType,
                                      get_file_server)
from handler.util.user_util import verify_password

from .auths import Session
from .common.exception import NotFound, Unauthenticated
from .db.db_util import run_sql_with_param, run_sql_with_param_and_fetch_one
from .util.notifier import Notifier

VERIFICATION_CODES_TABLE = 'verification_codes'
logger = logging.getLogger(os.path.basename(__file__))


class UserHandler(HandlerBase):
    def create_user(self, parent: str, user: ModelUser,
                    handler_context: HandlerContext) -> Tuple[ModelUser, Session]:
        user = self._create(parent, user, handler_context)
        session = Session.create(user.user_id)
        return user, session

    def _create(self, parent: str, user: ModelUser,
                handler_context: HandlerContext) -> ModelUser:
        user.image_url = DEFAULT_USER_AVATAR
        user.settings = default_user_settings()
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
            if base_user.image_url and base_user.image_url != DEFAULT_USER_AVATAR:
                file_server = get_file_server(FileServerType.GCS)
                try:
                    file_server.delete_file(
                        BucketClass.REGULAR, base_user.image_url)
                except Exception as err:
                    logger.error(
                        f'Failed to delete {base_user.image_url}: {err}')
        if user.username != base_user.username:
            validate_username(user.username)
        if user.email != base_user.email:
            validate_email(user.email)
        user.update(actor_info=user.user_id)
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
            raise Unauthenticated('验证码不正确')
        try:
            user = get_user_by_email(email)
        except NotFound:
            user = None
        return True, user


def generate_verification_code(email: str) -> str:
    '''
    Generate a verification_code and persist it into DB.
    '''
    sql = f'DELETE FROM {VERIFICATION_CODES_TABLE} WHERE email=%(email)s'
    run_sql_with_param(sql, {
        'email': email
    })

    verification_code = str(uuid.uuid1())
    sql = f'INSERT INTO {VERIFICATION_CODES_TABLE} (email, code) VALUES (%(email)s, %(code)s)'
    run_sql_with_param(sql, {
        'email': email,
        'code': verification_code
    })
    return verification_code


def get_code(email: str) -> str:
    sql = f'SELECT code FROM {VERIFICATION_CODES_TABLE} WHERE email=%(email)s'
    resp = run_sql_with_param_and_fetch_one(sql, {
        'email': email,
    })
    if not resp:
        raise NotFound(f'Verification code for email {email} is not found.')
    return str(resp[0])


def verify_code(email: str, code: str) -> bool:
    '''
    Return:
        True: if email and code match to existing record.
        False: anything else. 
    '''
    try:
        code_in_system = get_code(email)
    except NotFound:
        return False
    return code_in_system == code
