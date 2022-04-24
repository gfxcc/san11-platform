from __future__ import annotations

import datetime
import re
from typing import Iterable, List, Tuple

import attr
from google.protobuf import message
from handler.common.exception import AlreadyExists, InvalidArgument, NotFound
from handler.model.base import ListOptions
from handler.model.base.base_db import DbConverter
from handler.model.base.base_proto import ProtoConverter
from handler.model.model_activity import TrackLifecycle
from handler.util.name_util import ResourceName
from handler.util.user_util import hash_password, is_email, normalize_email

from ..protos import san11_platform_pb2 as pb
from .base import Attrib, InitModel, ModelBase

DEFAULT_USER_AVATAR = 'users/default_avatar.jpg'


class EmailProtoConverter(ProtoConverter):
    '''
    Normalize user entered email.
    '''

    def from_model(self, value: str) -> str:
        return normalize_email(value)

    def to_model(self, proto_value: str) -> str:
        return normalize_email(proto_value)


class EmailDbConverter(DbConverter):
    '''
    Normalize email before persisting.
    This is useful when handling legacy records.
    '''

    def from_model(self, value: str) -> str:
        return normalize_email(value)

    def to_model(self, proto_value: str) -> str:
        return normalize_email(proto_value)


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
        proto_converter=EmailProtoConverter(),
        db_converter=EmailDbConverter(),
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
    hashed_password = Attrib(
        type=str,
        is_proto_field=False,
    )
    subscriber_count = Attrib(
        type=int,
    )
    create_time = Attrib(
        type=datetime.datetime,
    )
    update_time = Attrib(
        type=datetime.datetime,
    )

    def to_pb(self) -> message.Message:
        # Field `user_id` only exist in public proto for easy access.
        ret = super().to_pb()
        setattr(ret, 'user_id', self.user_id)
        return ret

    @classmethod
    def from_pb(cls, proto_model: message.Message) -> ModelUser:
        return super().from_pb(proto_model)

    @classmethod
    def from_name(cls, name: str) -> ModelUser:
        return super().from_name(name)

    @classmethod
    def list(cls, list_options: ListOptions) -> Tuple[List[ModelUser], str]:
        return super().list(list_options)

    def is_admin(self) -> bool:
        return self.type == pb.User.UserType.ADMIN

    @property
    def user_id(self) -> int:
        return ResourceName.from_str(self.name).resource_id


def validate_email(email: str) -> None:
    '''
    Raise if
        InvalidArgument: if Invalid format
        AlreadyExists: if email is already used by an accout
    '''
    ADMIN_EMAIL = 'ycao181@gmail.com'
    if not is_email(email):
        raise InvalidArgument('无效的邮箱地址')
    # Allow admin to reuse email for new account for testing.
    if email == ADMIN_EMAIL:
        return
    if ModelUser.list(ListOptions(parent=None, filter=f'email=\"{email}\"'))[0]:
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
    if ModelUser.list(ListOptions(parent=None, filter=f'username="{username}"'))[0]:
        raise AlreadyExists(f'用户名 {username} 已被使用')


def validate_new_user(user: ModelUser) -> None:
    validate_username(user.username)
    validate_email(user.email)


def get_user_by_email(email: str) -> ModelUser:
    users = ModelUser.list(ListOptions(
        parent='', filter=f'email=\"{email}\"'))[0]
    if not users:
        raise NotFound(message=f'找不到注册邮箱为 {email} 的用户')
    return users[0]


def get_user_by_username(username: str) -> ModelUser:
    users = ModelUser.list(ListOptions(
        parent='', filter=f'username=\"{username}\"'))[0]
    if not users:
        raise NotFound(message=f'找不到用户名为 {username} 的用户')
    return users[0]


def get_admins() -> Iterable[ModelUser]:
    return ModelUser.list(ListOptions(parent=None, filter=f'type={pb.User.UserType.ADMIN}'))[0]
