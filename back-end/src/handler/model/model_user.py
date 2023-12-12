import datetime
import re
from dataclasses import dataclass
from dis import dis
from typing import Iterable, List, Tuple, Union

import attrs
from google.protobuf import message

from handler.common.exception import AlreadyExists, InvalidArgument, NotFound
from handler.model.base import ListOptions
from handler.model.base.base_db import DbConverter
from handler.model.base.base_proto import ProtoConverter
from handler.model.plugins.subscribable import Subscribable
from handler.model.plugins.tracklifecycle import TrackLifecycle
from handler.util.name_util import ResourceName
from handler.util.user_util import hash_password, is_email, normalize_email

from ..protos import san11_platform_pb2 as pb
from .base import (Attrib, BoolAttrib, DatetimeAttrib, InitModel, IntAttrib,
                   ModelBase, NestedAttrib, NestedModel, StrAttrib)

DEFAULT_USER_AVATAR = 'static/images/avatars/zhuge.jpeg'
PRESET_USER_AVATARS = 'static/images/avatars'


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
    db_table=None,
    proto_class=pb.UserSettings.NotificationSetting
)
@attrs.define
class NotificationSettings(NestedModel):
    send_emails: bool = BoolAttrib()
    subscriptions: bool = BoolAttrib()
    recommendations: bool = BoolAttrib()
    mentions: bool = BoolAttrib()
    threads: bool = BoolAttrib()
    comments: bool = BoolAttrib()
    replies: bool = BoolAttrib()


@InitModel(
    db_table=None,
    proto_class=pb.UserSettings
)
@attrs.define
class UserSettings(NestedModel):
    notification: NotificationSettings = NestedAttrib(
        nested_type=NotificationSettings
    )


@InitModel(
    db_table='users',
    proto_class=pb.User,
)
@attrs.define
class ModelUser(Subscribable, TrackLifecycle, ModelBase):
    # Resource name. It is `{parent}/users/{user_id}`
    # E.g. `users/12345`
    name: str = StrAttrib()
    username: str = StrAttrib()
    email: str = StrAttrib(
        proto_converter=EmailProtoConverter(),
        db_converter=EmailDbConverter(),
    )
    type: int = IntAttrib()
    image_url: str = StrAttrib()
    website: str = StrAttrib()
    hashed_password: str = StrAttrib(is_proto_field=False)
    subscriber_count: int = IntAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()
    settings: UserSettings = NestedAttrib(
        nested_type=UserSettings,
    )

    @classmethod
    def from_user_id(cls, user_id: int) -> 'ModelUser':
        return cls.from_name(f'users/{user_id}')

    def to_pb(self) -> message.Message:
        # Field `user_id` only exist in public proto for easy access.
        ret = super().to_pb()
        setattr(ret, 'user_id', self.user_id)
        return ret

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
    if not re.fullmatch(r'[^ @#$%^&*()=+{}\[\]|\\:<>?]{4,32}', username):
        raise InvalidArgument("用户名要求: [长度] 4-32 [字符] 不包含 空格, @, #, $, %, ^, &, *, (, ), =, +, {, }, [, ], |, \\, :, <, >, ?")
    if ModelUser.list(ListOptions(parent=None, filter=f'username="{username}"'))[0]:
        raise AlreadyExists(f'用户名 {username} 已被使用')


def validate_new_user(user: ModelUser) -> None:
    validate_username(user.username)
    validate_email(user.email)


def get_user_by_email(email: str) -> ModelUser:
    users = ModelUser.list(ListOptions(
        parent=None, filter=f'email=\"{email}\"'))[0]
    if not users:
        raise NotFound(message=f'找不到注册邮箱为 {email} 的用户')
    return users[0]


def get_user_by_username(username: str) -> ModelUser:
    users = ModelUser.list(ListOptions(
        parent=None, filter=f'username=\"{username}\"'))[0]
    if not users:
        raise NotFound(message=f'找不到用户名为 {username} 的用户')
    return users[0]


def get_admins() -> Iterable[ModelUser]:
    return ModelUser.list(ListOptions(parent=None, filter=f'type={pb.User.UserType.ADMIN}'))[0]


def default_user_settings() -> UserSettings:
    return UserSettings(
        notification=NotificationSettings(
            send_emails=True,
            subscriptions=True,
            recommendations=True,
            mentions=True,
            threads=True,
            comments=True,
            replies=True,
        )
    )