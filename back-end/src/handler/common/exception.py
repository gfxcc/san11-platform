# Referring https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
import attr


@attr.s(auto_attribs=True)
class Unauthenticated(Exception):
    message: str = '未验证的用户'
    code: int = 16


@attr.s(auto_attribs=True)
class PermissionDenied(Exception):
    message: str = '权限不足'
    code: int = 7


@attr.s(auto_attribs=True)
class AlreadyExists(Exception):
    message: str = '资源已存在'
    code: int = 6


@attr.s(auto_attribs=True)
class NotFound(Exception):
    message: str = '找不到资源'
    code: int = 5


@attr.s(auto_attribs=True)
class InvalidArgument(Exception):
    message: str = '不合法的参数'
    code: int = 3


@attr.s(auto_attribs=True)
class FailedPrecondition(Exception):
    message: str = '条件不满足'
    code: int = 9


@attr.s(auto_attribs=True)
class ResourceExhausted(Exception):
    message: str = '资源不足'
    code: int = 8


@attr.s(auto_attribs=True)
class Unimplemented(Exception):
    message: str = '尚未开放'
    code: int = 12
