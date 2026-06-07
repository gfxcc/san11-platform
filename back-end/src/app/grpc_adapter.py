from __future__ import annotations

import functools
import logging
import os
from typing import Callable, TypeVar

import grpc
from google.protobuf import message

from core.errors.exceptions import Excep
from app.handler_context import HandlerContext

logger = logging.getLogger(os.path.basename(__file__))

_SELF_T = TypeVar('_SELF_T')
_REQUEST_T = TypeVar('_REQUEST_T', bound=message.Message)
_RESPONSE_T = TypeVar('_RESPONSE_T')

_STATUS_CODES = {
    3: grpc.StatusCode.INVALID_ARGUMENT,
    5: grpc.StatusCode.NOT_FOUND,
    6: grpc.StatusCode.ALREADY_EXISTS,
    7: grpc.StatusCode.PERMISSION_DENIED,
    8: grpc.StatusCode.RESOURCE_EXHAUSTED,
    9: grpc.StatusCode.FAILED_PRECONDITION,
    12: grpc.StatusCode.UNIMPLEMENTED,
    16: grpc.StatusCode.UNAUTHENTICATED,
}


def grpc_abort_on_exception(
        func: Callable[[_SELF_T, _REQUEST_T, HandlerContext], _RESPONSE_T],
) -> Callable[[_SELF_T, _REQUEST_T, grpc.ServicerContext], _RESPONSE_T]:
    @functools.wraps(func)
    def wrapper(
            this: _SELF_T,
            request: _REQUEST_T,
            context: grpc.ServicerContext) -> _RESPONSE_T:
        try:
            logger.debug(f'Call to {func} -- request={request}')
            handler_context = HandlerContext.from_service_context(context)
            return func(this, request, handler_context)
        except Excep as err:
            logger.info(f'Client space error: {err}', exc_info=True)
            logger.info(f'request={request}')
            logger.info(f'context={dict(context.invocation_metadata())}')
            context.abort(
                code=_STATUS_CODES.get(err.code, grpc.StatusCode.UNKNOWN),
                details=err.message,
            )
        except Exception as err:
            logger.error(f'Server space error: {err}', exc_info=True)
            logger.error(f'request={request}')
            logger.error(f'context={dict(context.invocation_metadata())}')
            context.abort(code=grpc.StatusCode.INTERNAL, details='Internal error')
    return wrapper
