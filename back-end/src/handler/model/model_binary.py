import datetime
import logging
import os
from typing import Dict, List, Optional, Tuple

import attrs
from handler.model.base import ListOptions
from handler.model.plugins.tracklifecycle import TrackLifecycle
from handler.util.file_server import (BucketClass, FileServerType,
                                      get_file_server)

from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now
from .base import (Attrib, DatetimeAttrib, DbConverter, InitModel, IntAttrib,
                   LegacyDatetimeProtoConverter, ModelBase, NestedAttrib,
                   NestedModel, ProtoConverter, StrAttrib)

logger = logging.getLogger(os.path.basename(__file__))


class Version:
    def __init__(self, major: int, minor: int, patch: int) -> None:
        self.major = major
        self.minor = minor
        self.patch = patch

    def __str__(self) -> str:
        return f'v{self.major}.{self.minor}.{self.patch}'

    def to_pb(self) -> pb.Version:
        return pb.Version(
            major=self.major,
            minor=self.minor,
            patch=self.patch
        )

    @classmethod
    def from_pb(cls, obj: pb.Version):
        return cls(major=obj.major,
                   minor=obj.minor,
                   patch=obj.patch)

    @classmethod
    def from_str(cls, obj: str):
        return cls(*list(map(int, obj[1:].split('.'))))


class VersionProtoConverter(ProtoConverter):
    def from_model(self, value: Version) -> pb.Version:
        return value.to_pb()

    def to_model(self, proto_value: pb.Version) -> Version:
        return Version.from_pb(proto_value)


class VersionDbConverter(DbConverter):
    def from_model(self, value: Version) -> str:
        return str(value)

    def to_model(self, db_value: str) -> Version:
        return Version.from_str(db_value)


# @attrs.define(auto_attribs=True)
# class File:
#     ext: str
#     uri: str
#     filename: str = ''
#     url: str = ''
#     server: int = 0


# class FileProtoConverter(ProtoConverter):
#     def from_model(self, value: Optional[File]) -> Optional[pb.File]:
#         if value is None:
#             return None
#         return pb.File(
#             filename=value.filename,
#             ext=value.ext,
#             server=value.server,
#             uri=value.uri,
#             url=value.url,
#         )

#     def to_model(self, proto_value: Optional[pb.File]) -> Optional[File]:
#         if proto_value is None:
#             return None
#         return File(
#             filename=proto_value.filename,
#             ext=proto_value.ext,
#             server=proto_value.server,
#             uri=proto_value.uri,
#             url=proto_value.url,
#         )


# class FileDbConverter(DbConverter):
#     def from_model(self, value: Optional[File]) -> Optional[Dict]:
#         if value is None:
#             return None
#         return attrs.asdict(value)

#     def to_model(self, db_value: Optional[Dict]) -> Optional[File]:
#         if db_value is None:
#             return None
#         return File(**db_value)


@InitModel(
    db_table=None,
    proto_class=pb.File,
)
@attrs.define
class File(NestedModel):
    ext: str = StrAttrib()
    uri: str = StrAttrib()
    filename: str = StrAttrib()
    url: str = StrAttrib()
    server: int = IntAttrib()


@InitModel(
    db_table=None,
    proto_class=pb.CloudDiskFile
)
@attrs.define
class CloudDiskFile(NestedModel):
    url: str = StrAttrib()
    code: str = StrAttrib()


@InitModel(
    db_table='binaries',
    proto_class=pb.Binary,
)
@attrs.define
class ModelBinary(TrackLifecycle, ModelBase):
    # Resource name. It is `{parent}/packages/{package_id}`
    # E.g. `categories/1/packages/123/binaries/1`
    name: str = StrAttrib()
    download_count: int = IntAttrib()
    # TODO: Migrate to `NestedAttrib`
    version: Version = Attrib(
        proto_converter=VersionProtoConverter(),
        db_converter=VersionDbConverter(),
    )
    description: str = StrAttrib()
    tag: str = StrAttrib()
    size: str = StrAttrib()
    # BEGINNING - OneOf field resource
    file: File = NestedAttrib(
        nested_type=File,
    )
    download_method: str = StrAttrib()
    cloud_disk_file: CloudDiskFile = NestedAttrib(
        nested_type=CloudDiskFile,
    )
    # END - OneOf field resource
    create_time: datetime.datetime = DatetimeAttrib(
        proto_converter=LegacyDatetimeProtoConverter(),
    )
    update_time: datetime.datetime = DatetimeAttrib(
        proto_converter=LegacyDatetimeProtoConverter(),
    )

    def remove_resource(self) -> None:
        logger.debug(f'Remove resource of {self.name}: {self}')
        if self.file:
            server = get_file_server(FileServerType(self.file.server))
            server.delete_file(BucketClass.REGULAR, self.file.uri)
            self.size = ''

    def delete(self, actor_info: Optional[int] = None) -> None:
        self.remove_resource()
        return super(ModelBinary, self).delete(actor_info=actor_info)

    @classmethod
    def from_name(cls, name: str) -> 'ModelBinary':
        return super().from_name(name)

    @classmethod
    def list(cls, list_options: ListOptions) -> Tuple[List['ModelBinary'], str]:
        return super().list(list_options)
