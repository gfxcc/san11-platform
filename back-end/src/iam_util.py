import functools
import logging
import os
import re
from typing import Any, Callable, Optional, Tuple

from google.protobuf import message

from handler.auths.session import Session
from handler.common.exception import (NotFound, PermissionDenied,
                                      Unauthenticated)
from handler.model.model_user import ModelUser
from handler.model.user import User
from handler.protos import san11_platform_pb2 as pb
from handler.util.name_util import ResourceName
from handler.util.resource_parser import find_resource

ServerHandlerType = Callable[[Any, Any, Any], Any]
logger = logging.getLogger(os.path.basename(__file__))


def _get_session(context) -> Session:
    sid = dict(context.invocation_metadata()).get('sid', None)
    if not sid:
        raise Unauthenticated('sid is missing')
    return Session.from_sid(sid)


def load_user(context) -> ModelUser:
    session = _get_session(context)
    return session.user


def assert_admin(func: ServerHandlerType):
    @functools.wraps(func)
    def iam_wrapper(this, request, context):
        if context.user is None or context.user.type != pb.User.UserType.ADMIN:
            raise PermissionDenied(message='需要管理员权限')
        return func(this, request, context)
    return iam_wrapper


def assert_login(func: ServerHandlerType):
    @functools.wraps(func)
    def iam_wrapper(this, request, context):
        if context.user is None:
            raise Unauthenticated(message='未验证的用户，请尝试重新登录')
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
            if context.user is None:
                raise Unauthenticated()
            if context.user.user_id != _get_attr_by_path(request, path_to_user_id):
                raise PermissionDenied()
            return func(this, request, context)
        return iam_wrapper
    return wrap


def assert_resource_owner(resource_name_path: str, bypass: Optional[str] = None):
    '''
    (TODO): Support inherited ownership.
    Admin user will always overpass this check.
    Args:
        resource_name_path: Path from request to resource_name.
        bypass: bypass the assertion if the given statement is evaluated as `True`.
    '''
    def get_owner_id(resource) -> int:
        if isinstance(resource, ModelUser):
            return resource.user_id
        if hasattr(resource, 'author_id'):
            return getattr(resource, 'author_id')
        return 0

    def wrap(func):
        @functools.wraps(func)
        def iam_wrapper(this, request, context):
            current_user = context.user
            if not current_user.is_admin() and (bypass is None or eval(bypass) == False):
                cur = request
                for segment in resource_name_path.split('.'):
                    cur = getattr(cur, segment)
                
                name = ResourceName.from_str(cur)
                try:
                    while name:
                        resource = find_resource(name)
                        if get_owner_id(resource) == current_user.user_id:
                            return func(this, request, context)
                        name = name.parent
                except NotFound:
                    ...
                raise PermissionDenied()
            return func(this, request, context)
        return iam_wrapper
    return wrap


def _get_attr_by_path(request, path: str) -> Any:
    cur = request
    for seg in path.split('.'):
        cur = getattr(cur, seg)
    return cur
