from typing import Iterable

from google.protobuf import field_mask_pb2


class FieldMask:
    '''
    A local wrapper for official protobuf FieldMask.
    '''
    def __init__(self, paths: Iterable[str]) -> None:
        self.paths = set(paths)

    @classmethod
    def from_pb(cls, pb_obj: field_mask_pb2.FieldMask):
        return cls(paths=list(pb_obj.paths))

    def has(self, field: str) -> bool:
        return field in self.paths

    def discard(self, field: str) -> None:
        self.paths.discard(field)
