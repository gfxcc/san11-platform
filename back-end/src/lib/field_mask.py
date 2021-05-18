from __future__ import annotations
from typing import List
from copy import deepcopy

from .protos import san11_platform_pb2
from .resource import ResourceMixin


def merge_resource(base_resource: ResourceMixin, update_request: ResourceMixin, field_mask: FieldMask) -> ResourceMixin:
    updated_resource = deepcopy(base_resource)
    for path in field_mask.paths:
        exec(f'updated_resource.{path} = update_request.{path}')
    return updated_resource


class FieldMask:
    def __init__(self, paths: List[str]) -> None:
        self.paths = paths
    
    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.FieldMask):
        return cls(paths=list(pb_obj.paths))
