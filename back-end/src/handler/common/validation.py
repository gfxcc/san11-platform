from typing import Optional

from handler.common.exception import PermissionDenied, Unauthenticated
from handler.model.model_user import ModelUser


def require_authenticated(user: Optional[ModelUser], message: str = '未验证的用户') -> ModelUser:
    if user is None:
        raise Unauthenticated(message=message)
    return user


def require_permission(condition: bool, message: str = '权限不足') -> None:
    if not condition:
        raise PermissionDenied(message=message)


def require_authenticated_condition(condition: bool, message: str = '未验证的用户') -> None:
    if not condition:
        raise Unauthenticated(message=message)


def require_admin(user: Optional[ModelUser], message: str = '权限不足') -> ModelUser:
    user = require_authenticated(user)
    require_permission(user.is_admin(), message)
    return user
