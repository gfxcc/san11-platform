from __future__ import annotations

from copy import deepcopy
from typing import Iterable, Union

import attr

from ..model.base import MODEL_T, ModelBase, is_repeated
from ..model.resource import ResourceMixin
from ..protos import san11_platform_pb2


def merge_resource(base_resource: Union[ResourceMixin | MODEL_T],
                   update_request: Union[ResourceMixin | MODEL_T],
                   field_mask: FieldMask) -> Union[ResourceMixin | MODEL_T]:
    if isinstance(base_resource, ResourceMixin) and isinstance(update_request, ResourceMixin):
        updated_resource = deepcopy(base_resource)
        for path in field_mask.paths:
            exec(f'updated_resource.{path} = update_request.{path}')
        return updated_resource
    elif isinstance(base_resource, ModelBase) and isinstance(update_request, ModelBase):
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


class FieldMask:
    def __init__(self, paths: Iterable[str]) -> None:
        self.paths = set(paths)

    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.FieldMask):
        return cls(paths=list(pb_obj.paths))

    def has(self, field: str) -> bool:
        return field in self.paths

    def discard(self, field: str) -> None:
        self.paths.discard(field)
