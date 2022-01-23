
from abc import ABC
from typing import Optional, Type

from handler.model.model_activity import Action, ModelActivity, TrackLifecycle
from handler.util.time_util import get_now

from .base import MODEL_T, Attrib, InitModel
from .base_core import is_repeated
from .base_db import DbConverter
from .base_proto import (DatetimeProtoConverter, LegacyDatetimeProtoConverter,
                         ProtoConverter)


# TODO: integrate TrackLifecycle
class ModelBase(base_db.DbModelBase, base_proto.ProtoModelBase):

    def create(self, parent: str, user_id: Optional[int] = None) -> None:
        base_db.DbModelBase.create(self, parent)
        if isinstance(self, TrackLifecycle) and user_id:
            ModelActivity(name='',
                          create_time=get_now(),
                          action=Action.CREATE.value,
                          resource_name=self.name).create(parent=f'users/{user_id}')

    def update(self, update_update_time: bool = True, user_id: Optional[int] = None) -> None:
        base_db.DbModelBase.update(self, update_update_time=update_update_time)
        if isinstance(self, TrackLifecycle) and user_id:
            ModelActivity(name='',
                          create_time=get_now(),
                          action=Action.UPDATE.value,
                          resource_name=self.name).create(parent=f'users/{user_id}')

    def delete(self, user_id: Optional[int] = None) -> None:
        base_db.DbModelBase.delete(self)
        if isinstance(self, TrackLifecycle) and user_id:
            ModelActivity(name='',
                          create_time=get_now(),
                          action=Action.DELETE.value,
                          resource_name=self.name).create(parent=f'users/{user_id}')


class Context(ABC):
    '''
    Provides metadata/operations.
    '''
    ...


class HandlerBase(ABC):
    '''
    Provides CRUD operations on resource classes.
    '''
    def create(self, parent: str, resource: Type[ModelBase], handler_context: Type[Context]):
        ...
    
    def get(self, name: str, handler_context):
        ...

    def list(self, list_options, handler_context):
        ...

    def update(self, request, handler_context):
        ...

    def delete(self, request, handler_context):
        ...
