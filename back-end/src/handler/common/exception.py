# Referring https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
import attr


class Excep(Exception):
    def __str__(self):
        return f'<Excep object; code={self.code}; message={self.message}>'
    message: str = '未定义'
    code: int = 0


@attr.s(auto_attribs=True)
class Unauthenticated(Excep):
    message: str = '未验证的用户'
    code: int = 16


@attr.s(auto_attribs=True)
class PermissionDenied(Excep):
    message: str = '权限不足'
    code: int = 7


@attr.s(auto_attribs=True)
class AlreadyExists(Excep):
    message: str = '资源已存在'
    code: int = 6


@attr.s(auto_attribs=True)
class NotFound(Excep):
    message: str = '找不到资源'
    code: int = 5


@attr.s(auto_attribs=True)
class InvalidArgument(Excep):
    message: str = '不合法的参数'
    code: int = 3


@attr.s(auto_attribs=True)
class FailedPrecondition(Excep):
    message: str = '条件不满足'
    code: int = 9


@attr.s(auto_attribs=True)
class ResourceExhausted(Excep):
    message: str = '资源不足'
    code: int = 8


@attr.s(auto_attribs=True)
class Unimplemented(Excep):
    message: str = '尚未开放'
    code: int = 12
