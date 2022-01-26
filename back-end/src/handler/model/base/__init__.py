'''
A model is an internal representation of a resource. 
In most case, a resource could exists in 3 differnt layers.
        Layer           | Data state        | file sample
    --------------------+-------------------+---------------
    Grpc layer          | protobuff message | san11_platform_pb2.py (generated)
    Logic/Handler layer | ModelBase         | handler/xxxx_handler.py
    Data layer          | Db schema         | base_db.py

# Dependency


                   ┌──────────────────────────────────────────────────────────────────┐
                   │                                                                  │
       interface   │                                                                  │
                   │            ┌───────────┐                                         │
                   │            │__init__.py│                                         │
                   │            └─────┬─────┘                                         │
                   │                  │                                               │
                   ├──────────────────┼───────────────────────────────────────────────┤
                   │                  │                                               │
                   │            ┌─────▼─┐                                             │
                   │            │base.py│                                             │
                   │            └─────┬─┘                                             │
    implementation │                  │                                               │
                   │                  │                                               │
                   │            ┌─────▼────┐                                          │
                   │            │base_db.py│                                          │
                   │            └─────┬────┘                                          │
                   │                  │                                               │
                   │                  │                                               │
                   │            ┌─────▼───────┐                                       │
                   │            │base_proto.py│                                       │
                   │            └─────┬───────┘                                       │
                   │                  │                                               │
                   ├──────────────────┼───────────────────────────────────────────────┤
                   │                  │                                               │
                   │            ┌─────▼──────┐    ┌─────────┐                         │
    core/utility   │            │base_core.py│    │common.py│                         │
                   │            └────────────┘    └─────────┘                         │
                   │                                                                  │
                   └──────────────────────────────────────────────────────────────────┘

```

# Usage:

@InitModel(
    ...
)
@attr.s
class MyModel(ModelBase):
    first_attr = Attrib(
        ...
    )
    ...

## OneOf field
Fields in oneOf field should be listed in Model as flat fields.

E.g. 
    OneOf resource = {
        string uri = 1;
        int64 id = 2;
    }
    
    =>>

    uri = Attrib(...)
    id = Attrib()
'''
from __future__ import annotations

from abc import ABC
from copy import deepcopy
from typing import List, Optional, Tuple, Type, TypeVar

import attr
from handler.model.model_activity import Action, ModelActivity, TrackLifecycle
from handler.util.time_util import get_now

from .base import Attrib, InitModel
from .base_core import is_repeated
from .base_db import DbConverter, ListOptions
from .base_proto import (DatetimeProtoConverter, LegacyDatetimeProtoConverter,
                         ProtoConverter)
from .common import FieldMask

_SUB_MODEL_BASE_T = TypeVar('_SUB_MODEL_BASE_T', bound='ModelBase')

# TODO: integrate TrackLifecycle


class ModelBase(base_db.DbModelBase, base_proto.ProtoModelBase):
    def create(self, parent: str, user_id: Optional[int] = None, create_activity: bool = True) -> None:
        base_db.DbModelBase.create(self, parent)
        if isinstance(self, TrackLifecycle) and user_id and create_activity:
            ModelActivity(name='',
                          create_time=get_now(),
                          action=Action.CREATE.value,
                          resource_name=self.name).create(parent=f'users/{user_id}')

    def update(self, update_update_time: bool = True, user_id: Optional[int] = None, create_activity: bool = True) -> None:
        base_db.DbModelBase.update(self, update_update_time=update_update_time)
        if isinstance(self, TrackLifecycle) and user_id and create_activity:
            ModelActivity(name='',
                          create_time=get_now(),
                          action=Action.UPDATE.value,
                          resource_name=self.name).create(parent=f'users/{user_id}')

    def delete(self, user_id: Optional[int] = None, create_activity: bool = True) -> None:
        base_db.DbModelBase.delete(self)
        if isinstance(self, TrackLifecycle) and user_id and create_activity:
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

    def create(self, parent: str, resource: Type[ModelBase], handler_context: Type[Context]) -> Type[ModelBase]:
        ...

    def get(self, name: str, handler_context: Type[Context]) -> Type[ModelBase]:
        ...

    def list(self, list_options: ListOptions, handler_context: Type[Context]) -> Tuple[List[Type[ModelBase]], str]:
        ...

    def update(self, update_resource: Type[ModelBase], update_mask: FieldMask, handler_context: Type[Context]) -> Type[ModelBase]:
        ...

    def delete(self, name: str, handler_context: Type[Context]) -> Type[ModelBase]:
        ...


def merge_resource(base_resource: _SUB_MODEL_BASE_T,
                   update_request: _SUB_MODEL_BASE_T,
                   field_mask: FieldMask) -> _SUB_MODEL_BASE_T:
    if isinstance(base_resource, ModelBase) and isinstance(update_request, ModelBase):
        updated_resource = deepcopy(base_resource)
        for path in field_mask.paths:
            if is_repeated(attr.fields_dict(type(base_resource))[path]):
                getattr(updated_resource, path)[
                    :] = getattr(update_request, path)
            else:
                setattr(updated_resource, path, getattr(update_request, path))
        return updated_resource
    else:
        raise ValueError(f'unsupport type: {base_resource}, {update_request}')
