# Referring https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto

class Unauthenticated(Exception):
    code = 16


class PermissionDenied(Exception):
    code = 7


class AlreadyExists(Exception):
    code = 6


class NotFound(Exception):
    code = 5


class INVALID_ARGUMENT(Exception):
    code = 3