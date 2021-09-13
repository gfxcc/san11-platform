import functools, re
from handler.util.resource_parser import find_resource

from google.protobuf import message
from handler.common.exception import PermissionDenied
from handler.auths.session import Session
from typing import Any, Callable, Tuple


ServerHandlerType = Callable[[Any, Any, Any], Any]


def _get_session(context) -> Session:
    sid = dict(context.invocation_metadata()).get('sid', None)
    if not sid:
        context.abort(PermissionDenied().code, '请登录')
    return Session.from_sid(sid)


def assert_admin(func: ServerHandlerType):
    @functools.wraps(func)
    def iam_wrapper(this, request, context):
        if not _get_session(context).user.is_admin():
            context.abort(PermissionDenied().code, '需要管理员权限')
        return func(this, request, context)
    return iam_wrapper


def assert_login(func: ServerHandlerType):
    @functools.wraps(func)
    def iam_wrapper(this, request, context):
        _get_session(context)
        return func(this, request, context)
    return iam_wrapper



def assert_resource_owner(user_id_pattern: str):
    '''
    Admin user will always overpass this check.
    Args:
        resource_name_path: Path from request to resource_name and path from resource to user_id can be 
            supplied in the format as `{path_to_resource_name}.path_to_user_id`.
                E.g. `{user}.custom_user_id`
            if `.path_to_user_id` is omitted, default value `author_id` will be applied.
    '''
    def parse_user_id_path(user_id_path: str) -> Tuple[str, str]:
        '''
        Returns: (path_to_resource, path_to_user_id)
        '''
        NAME_PATTERN = r'{(?P<path_to_resource>[\w\.]+)}(\.(?P<path_to_user_id>[\w\.]+))?'
        match = re.fullmatch(NAME_PATTERN, user_id_path)
        assert match
        return match['path_to_resource'], match['path_to_user_id'] or 'author_id'

    def wrap(func):
        @functools.wraps(func)
        def iam_wrapper(this, request, context):
            resource_path, user_id_path = parse_user_id_path(user_id_pattern)
            cur = request
            for segment in resource_path.split('.'):
                cur = getattr(cur, segment)
            else:
                resource = find_resource(cur)
            cur = resource
            for segment in user_id_path.split('.'):
                cur = getattr(cur, segment)
            else:
                user_id = cur

            user = _get_session(context).user
            if not (user_id == user.user_id or user.is_admin()):
                context.abort(PermissionDenied().code,
                              PermissionDenied().message)
            return func(this, request, context)
        return iam_wrapper
    return wrap
