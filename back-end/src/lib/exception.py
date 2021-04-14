# Referring https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto

class Unauthenticated(Exception):
    code = 16


class PermissionDenied(Exception):
    code = 7
