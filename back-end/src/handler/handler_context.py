from __future__ import annotations

from typing import Optional

import attrs
import grpc

from handler.auths.session import Session
from handler.common.exception import NotFound, Unauthenticated

from .model.model_user import ModelUser


@attrs.define(auto_attribs=True)
class HandlerContext:
    user: Optional[ModelUser]
    client: Optional[str]
    service_context: Optional[grpc.ServicerContext]

    @classmethod
    def from_service_context(cls, service_context: grpc.ServicerContext) -> HandlerContext:
        '''
        Constructs a HandlerContext. A valid session is not required.
        '''
        session = None
        sid = dict(service_context.invocation_metadata()).get('sid', None)
        client = dict(service_context.invocation_metadata()).get('client', None)
        if not sid:
            return cls(user=None, service_context=None, client=client)
        try:
            session = Session.from_sid(sid)
        except (Unauthenticated, NotFound):
            return cls(user=None, service_context=None, client=client)
        else:
            return cls(user=session.user, service_context=service_context, client=client)
    
    def __str__(self) -> str:
        return f'HandlerContext(user={self.user}, client={self.client})'
