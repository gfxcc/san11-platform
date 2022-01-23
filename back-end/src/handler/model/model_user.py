import datetime
import re
from typing import Optional

import attr
from handler.common.exception import AlreadyExists, InvalidArgument
from handler.model.base.base_db import ListOptions
from handler.model.model_activity import TrackLifecycle
from handler.model.model_comment import ModelComment
from handler.util.name_util import ResourceName

from ..protos import san11_platform_pb2 as pb
from .base import Attrib, InitModel, ModelBase


@InitModel(
    db_table='users',
    proto_class=pb.User,
)
@attr.s
class ModelUser(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/users/{user_id}`
    # E.g. `users/12345`
    name = Attrib(
        type=str,
    )
    username = Attrib(
        type=str,
    )
    email = Attrib(
        type=str,
    )
    type = Attrib(
        type=int,  # TODO
    )
    image_url = Attrib(
        type=str,
    )
    website = Attrib(
        type=str,
    )
    password = Attrib(
        type=str,
        is_proto_field=False,
    )

    @property
    def user_id(self) -> int:
        return ResourceName.from_str(self.name).resource_id

    @classmethod
    def from_v1(cls, legacy_model):
        return cls(
            name='',
            user_id=legacy_model.user_id,
            username=legacy_model.username,
            email=legacy_model.email,
            user_type=1 if legacy_model.user_type == 'admin' else 11,
            image_url=legacy_model.image_url,
            website=legacy_model.website,
        )


def validate_email(email: str) -> None:
    '''
    Raise if
        InvalidArgument: if Invalid format
        AlreadyExists: if email is already used by an accout
    '''
    ADMIN_EMAIL = 'ycao181@gmail.com'
    if re.fullmatch(r'[^@]+@[^@]+\.[^@]+', email) is None:
        raise InvalidArgument('无效的邮箱地址')
    # Allow admin to reuse email for new account for testing.
    if email == ADMIN_EMAIL:
        return
    if ModelUser.list(ListOptions(parent='', filter=f'email=\"{email}\"'))[0]:
        raise AlreadyExists("邮箱已被使用")


def validate_password(password: str) -> None:
    if re.fullmatch(r'[0-9a-zA-Z\-_]{4,32}', password) is None:
        raise InvalidArgument("密码要求: [长度] 4-32 [字符] 英文字母大小写 数字 - _")


def validate_username(username: str) -> None:
    '''
    Raise:
        InvalidArgument: if username is illegal
        AlreadyExists: if username is already used in db
    '''
    if not re.fullmatch(r'[^ @]{4,32}', username):
        raise InvalidArgument("用户名要求: [长度] 4-32 [字符] 不包含 空格, @")
    if ModelUser.list(ListOptions(parent='', filter=f'username=\"{username}\"'))[0]:
        raise AlreadyExists(f'用户名 {username} 已被使用')
