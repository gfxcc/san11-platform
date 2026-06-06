from __future__ import annotations

import functools
import logging
import os
from typing import Any, Callable

import grpc
from google.protobuf import message

from core.errors.exceptions import Excep
from app.handler_context import HandlerContext

logger = logging.getLogger(os.path.basename(__file__))

RpcFunc = Callable[[Any, message.Message, HandlerContext], Any]


def grpc_abort_on_exception(func: RpcFunc) -> RpcFunc:
    @functools.wraps(func)
    def wrapper(this, request: message.Message, context: grpc.ServicerContext):
        try:
            logger.debug(f'Call to {func} -- request={request}')
            handler_context = HandlerContext.from_service_context(context)
            return func(this, request, handler_context)
        except Excep as err:
            logger.info(f'Client space error: {err}', exc_info=True)
            logger.info(f'request={request}')
            logger.info(f'context={dict(context.invocation_metadata())}')
            context.abort(code=err.code, details=err.message)
        except Exception as err:
            logger.error(f'Server space error: {err}', exc_info=True)
            logger.error(f'request={request}')
            logger.error(f'context={dict(context.invocation_metadata())}')
            context.abort(code=255, details='Internal error')
    return wrapper
