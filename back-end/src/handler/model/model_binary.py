from handler.model.binary import Binary
import logging
import os
import attr
import datetime
from typing import Dict, List, Optional

from .base import Attrib, InitModel, ModelBase, LegacyDatetimeProtoConverter, DbConverter, ProtoConverter
from .activity import TrackLifecycle
from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now
from ..util import gcs


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


@attr.s(auto_attribs=True)
class File:
    filename: str
    ext: str
    uri: str


class FileProtoConverter(ProtoConverter):
    def from_model(self, value: Optional[File]) -> Optional[pb.File]:
        if value is None:
            return None
        return pb.File(
            filename=value.filename,
            ext=value.ext,
            uri=value.uri,
        )

    def to_model(self, proto_value: Optional[pb.File]) -> Optional[File]:
        if proto_value is None:
            return None
        return File(
            filename=proto_value.filename,
            ext=proto_value.ext,
            uri=proto_value.uri,
        )


class FileDbConverter(DbConverter):
    def from_model(self, value: Optional[File]) -> Optional[Dict]:
        if value is None:
            return None
        return attr.asdict(value)

    def to_model(self, db_value: Optional[Dict]) -> Optional[File]:
        if db_value is None:
            return None
        return File(**db_value)


@InitModel(
    db_table='binaries',
    proto_class=pb.Binary,
)
@attr.s
class ModelBinary(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/packages/{package_id}`
    # E.g. `categories/1/packages/123/binaries/1`
    name = Attrib(
        type=str,
    )
    download_count = Attrib(
        type=int,
    )
    version = Attrib(
        type=Version,
        proto_converter=VersionProtoConverter(),
        db_converter=VersionDbConverter(),
    )
    description = Attrib(
        type=str,
    )
    tag = Attrib(
        type=str,
    )
    size = Attrib(
        type=str,
    )

    # BEGINNING - OneOf field resource
    file = Attrib(
        type=File,
        proto_converter=FileProtoConverter(),
        db_converter=FileDbConverter(),
    )
    download_method = Attrib(
        type=str,
    )
    # END

    create_time = Attrib(
        type=datetime.datetime,
        proto_converter=LegacyDatetimeProtoConverter(),
        default=get_now(),
    )
    update_time = Attrib(
        type=datetime.datetime,
        proto_converter=LegacyDatetimeProtoConverter(),
        default=get_now(),
    )
    # DEPRECATED
    url = Attrib(
        type=str,
        deprecated=True,
    )

    def remove_resource(self) -> None:
        if self.file:
            gcs.delete_canonical_resource(self.file.uri)
            self.size = ''

    def delete(self, **kwargs) -> None:
        self.remove_resource()
        super(ModelBinary, self).delete(**kwargs)
    
    @classmethod
    def from_v1(cls, legacy_model: Binary):
        return cls(
            name=legacy_model.name,
            url=legacy_model.url,
            download_count=legacy_model.download_count,
            version=legacy_model.version,
            description=legacy_model.description,
            tag=legacy_model.tag,
            file=legacy_model.file,
            download_method=legacy_model.download_method,
            size=legacy_model.size,
            create_time=legacy_model.create_time,
            update_time=legacy_model.create_time,
        )


# TODO: remove type for data migration
@InitModel(
    db_table='binaries_model_v1',
    proto_class=pb.Binary,
)
@attr.s
class ModelBinaryV1(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/packages/{package_id}`
    # E.g. `categories/1/packages/123/binaries/1`
    name = Attrib(
        type=str,
    )
    download_count = Attrib(
        type=int,
    )
    version = Attrib(
        type=Version,
        proto_converter=VersionProtoConverter(),
        db_converter=VersionDbConverter(),
    )
    description = Attrib(
        type=str,
    )
    tag = Attrib(
        type=str,
    )
    size = Attrib(
        type=str,
    )

    # BEGINNING - OneOf field resource
    file = Attrib(
        type=File,
        proto_converter=FileProtoConverter(),
        db_converter=FileDbConverter(),
    )
    download_method = Attrib(
        type=str,
    )
    # END

    create_time = Attrib(
        type=datetime.datetime,
        proto_converter=LegacyDatetimeProtoConverter(),
        default=get_now(),
    )
    update_time = Attrib(
        type=datetime.datetime,
        proto_converter=LegacyDatetimeProtoConverter(),
        default=get_now(),
    )
    # DEPRECATED
    url = Attrib(
        type=str,
        deprecated=True,
    )

    def remove_resource(self) -> None:
        if self.file:
            gcs.delete_canonical_resource(self.file.uri)
            self.size = ''

    def delete(self, **kwargs) -> None:
        self.remove_resource()
        super(ModelBinary, self).delete(**kwargs)
