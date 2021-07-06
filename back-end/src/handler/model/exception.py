# Referring https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto

class Unauthenticated(Exception):
    code = 16
    message = '未验证的用户'


class PermissionDenied(Exception):
    code = 7
    message = '权限不足'


class AlreadyExists(Exception):
    code = 6
    message = '资源已存在'


class NotFound(Exception):
    code = 5
    message = '找不到资源'


class InvalidArgument(Exception):
    code = 3
    message = '不合法的参数'

class FailedPrecondition(Exception):
    code = 9
    message = '条件不满足'