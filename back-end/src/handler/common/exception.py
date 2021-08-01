# Referring https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
import attr

@attr.s(auto_attribs=True)
class Unauthenticated(Exception):
    code = 16
    message = '未验证的用户'


@attr.s(auto_attribs=True)
class PermissionDenied(Exception):
    code = 7
    message = '权限不足'


@attr.s(auto_attribs=True)
class AlreadyExists(Exception):
    code = 6
    message = '资源已存在'


@attr.s(auto_attribs=True)
class NotFound(Exception):
    code = 5
    message = '找不到资源'


@attr.s(auto_attribs=True)
class InvalidArgument(Exception):
    code = 3
    message = '不合法的参数'


@attr.s(auto_attribs=True)
class FailedPrecondition(Exception):
    code = 9
    message = '条件不满足'


@attr.s(auto_attribs=True)
class ResourceExhausted(Exception):
    code = 8
    message = '资源不足'


@attr.s(auto_attribs=True)
class Unimplemented(Exception):
    code = 12
    message = '尚未开放'