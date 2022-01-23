import functools
import logging
import os
import re
from typing import Any, Callable, Tuple

from google.protobuf import message

from handler.auths.session import Session
from handler.common.exception import PermissionDenied, Unauthenticated
from handler.model.user import User
from handler.protos import san11_platform_pb2 as pb
from handler.util.resource_parser import find_resource

ServerHandlerType = Callable[[Any, Any, Any], Any]
logger = logging.getLogger(os.path.basename(__file__))


def _get_session(context) -> Session:
    sid = dict(context.invocation_metadata()).get('sid', None)
    if not sid:
        raise Unauthenticated('sid is missing')
    return Session.from_sid(sid)


def load_user(context) -> User:
    session = _get_session(context)
    return session.user


def assert_admin(func: ServerHandlerType):
    @functools.wraps(func)
    def iam_wrapper(this, request, context):
        if _get_session(context).user.type != pb.User.UserType.ADMIN:
            context.abort(PermissionDenied().code, '需要管理员权限')
        return func(this, request, context)
    return iam_wrapper


def assert_login(func: ServerHandlerType):
    @functools.wraps(func)
    def iam_wrapper(this, request, context):
        try:
            _get_session(context)
        except Unauthenticated as e:
            logger.info(f'unauthenticated user: {e}')
            context.abort(PermissionDenied().code, '请登录')
        else:
            return func(this, request, context)
    return iam_wrapper


def assert_user(path_to_user_id: str):
    '''
    Admin user will always overpass this check.
    Args:
        path_to_user_id: Path from request to `user_id`.
    '''
    def wrap(func):
        @functools.wraps(func)
        def iam_wrapper(this, request, context):
            try:
                session = _get_session(context)
            except Unauthenticated as e:
                logger.info(f'unauthenticated user: {e}')
                context.abort(Unauthenticated().code, Unauthenticated().message)
            else:
                if session.user.user_id != _get_attr_by_path(request, path_to_user_id):
                    context.abort(PermissionDenied().code, PermissionDenied().message)
                return func(this, request, context)
        return iam_wrapper
    return wrap


def assert_resource_owner(user_id_pattern: str):
    '''
    (TODO): Support inherited ownership.
    Admin user will always overpass this check.
    Args:
        resource_name_path: Path from request to resource_name and path from resource to user_id can be 
            supplied in the format as `{path_to_resource_name}.path_to_user_id`.
                E.g. `{user}.path_to_user_id`
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
    
    def get_resource_owner_id(resource, owner_id_path: str) -> int:
        if isinstance(resource, User):
            return resource.user_id
        cur = resource
        for segment in owner_id_path.split('.'):
            cur = getattr(cur, segment)
        else:
            user_id = cur
        return user_id

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
            user_id = get_resource_owner_id(resource, user_id_path)

            user = _get_session(context).user
            if not (user_id == user.user_id or user.is_admin()):
                context.abort(PermissionDenied().code,
                              PermissionDenied().message)
            return func(this, request, context)
        return iam_wrapper
    return wrap


def _get_attr_by_path(request, path: str) -> Any:
    cur = request
    for seg in path.split('.'):
        cur = getattr(cur, seg)
    return cur
