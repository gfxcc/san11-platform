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
@attrs.define
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
from typing import List, Optional, Tuple, Type, TypeVar, Union

import attrs

# from handler.model.model_activity import Action, ModelActivity, TrackLifecycle
from handler.util.time_util import get_now

# Export sections
from .base import (Attrib, BoolAttrib, BoolListAttrib, DatetimeAttrib,
                   DatetimeListAttrib, InitModel, IntAttrib, IntListAttrib,
                   NestedAttrib, StrAttrib, StrListAttrib)
from .base_core import is_repeated
from .base_db import DbConverter  # noqa
from .base_proto import DatetimeProtoConverter  # noqa
from .base_proto import ProtoConverter  # noqa
from .base_proto import LegacyDatetimeProtoConverter
from .common.field_mask import FieldMask  # noqa
from .common.list_options import MAX_PAGE_SIZE, ListOptions  # noqa

_SUB_MODEL_BASE_T = TypeVar('_SUB_MODEL_BASE_T', bound='ModelBase')

# TODO: integrate TrackLifecycle


class LifecycleEventsBase(ABC):
    def create(self, parent: str, actor_info: Optional[Union[int, str]] = None):
        ...

    def update(self, update_update_time: bool = True, actor_info: Optional[Union[int, str]] = None):
        ...

    def delete(self, actor_info: Optional[Union[int, str]]):
        ...


class ModelBase(base_db.DbModel, base_proto.ProtoModelBase, LifecycleEventsBase):
    name: str

    # TODO: Migrate callers to pass `actor_info` in `str`. E.g. `users/123`
    def create(self, parent: str, actor_info: Optional[Union[int, str]] = None) -> None:
        base_db.DbModel.create(self, parent)

    # TODO: Migrate callers to pass `actor_info` in `str`. E.g. `users/123`
    def update(self, update_update_time: bool = True, actor_info: Optional[Union[int, str]] = None) -> None:
        base_db.DbModel.update(self, update_update_time=update_update_time)

    # TODO: Migrate callers to pass `actor_info` in `str`. E.g. `users/123`
    def delete(self, actor_info: Optional[Union[int, str]]) -> None:
        base_db.DbModel.delete(self)


class NestedModel(base_proto.ProtoModelBase, base_db.DbModelBase):
    '''A nested model which only exist as a submessage of another model.'''
    ...


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
            if is_repeated(attrs.fields_dict(type(base_resource))[path]):
                getattr(updated_resource, path)[
                    :] = getattr(update_request, path)
            else:
                setattr(updated_resource, path, getattr(update_request, path))
        return updated_resource
    else:
        raise ValueError(f'unsupport type: {base_resource}, {update_request}')
