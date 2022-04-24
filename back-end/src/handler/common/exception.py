# Referring https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
from dataclasses import dataclass

import attr


class Excep(Exception):
    def __str__(self):
        return f'<Excep object; code={self.code}; message={self.message}>'
    message: str = '未定义'
    code: int = 0


@dataclass
class Unauthenticated(Excep):
    message: str = '未验证的用户'
    code: int = 16


@dataclass
class PermissionDenied(Excep):
    message: str = '权限不足'
    code: int = 7


@dataclass
class AlreadyExists(Excep):
    message: str = '资源已存在'
    code: int = 6


@dataclass
class NotFound(Excep):
    message: str = '找不到资源'
    code: int = 5


@dataclass
class InvalidArgument(Excep):
    message: str = '不合法的参数'
    code: int = 3


@dataclass
class FailedPrecondition(Excep):
    message: str = '条件不满足'
    code: int = 9


@dataclass
class ResourceExhausted(Excep):
    message: str = '资源不足'
    code: int = 8


@dataclass
class Unimplemented(Excep):
    message: str = '尚未开放'
    code: int = 12
