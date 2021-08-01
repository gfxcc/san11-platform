# Referring https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
import attr


@attr.s(auto_attribs=True)
class Unauthenticated(Exception):
    code: int = 16
    message: str = '未验证的用户'


@attr.s(auto_attribs=True)
class PermissionDenied(Exception):
    code: int = 7
    message: str = '权限不足'


@attr.s(auto_attribs=True)
class AlreadyExists(Exception):
    code: int = 6
    message: str = '资源已存在'


@attr.s(auto_attribs=True)
class NotFound(Exception):
    code: int = 5
    message: str = '找不到资源'


@attr.s(auto_attribs=True)
class InvalidArgument(Exception):
    code: int = 3
    message: str = '不合法的参数'


@attr.s(auto_attribs=True)
class FailedPrecondition(Exception):
    code: int = 9
    message: str = '条件不满足'


@attr.s(auto_attribs=True)
class ResourceExhausted(Exception):
    code: int = 8
    message: str = '资源不足'


@attr.s(auto_attribs=True)
class Unimplemented(Exception):
    code: int = 12
    message: str = '尚未开放'
