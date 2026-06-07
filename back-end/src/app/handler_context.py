from __future__ import annotations

from typing import Optional, Union

import attrs
import grpc

from core.auth.session import Session
from core.errors.exceptions import NotFound, Unauthenticated

from models.model_user import ModelUser


@attrs.define(auto_attribs=True)
class HandlerContext:
    user: Optional[ModelUser]
    client: Optional[str]
    service_context: Optional[grpc.ServicerContext]

    @property
    def authenticated_user(self) -> ModelUser:
        if self.user is None:
            raise Unauthenticated()
        return self.user

    @classmethod
    def from_service_context(cls, service_context: grpc.ServicerContext) -> HandlerContext:
        '''
        Constructs a HandlerContext. A valid session is not required.
        '''
        session = None
        metadata = dict(service_context.invocation_metadata())
        sid = _metadata_text(metadata.get('sid'))
        client = _metadata_text(metadata.get('client'))
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


def _metadata_text(value: Optional[Union[str, bytes]]) -> Optional[str]:
    if isinstance(value, bytes):
        return value.decode()
    return value
