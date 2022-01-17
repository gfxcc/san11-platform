import datetime
import logging
import os

import attr
from handler.model.model_tag import ModelTag

from ..protos import san11_platform_pb2 as pb
from .base import (Attrib, DbConverter, InitModel,
                   LegacyDatetimeProtoConverter, ModelBase, ProtoConverter)
from .model_activity import TrackLifecycle

logger = logging.getLogger(os.path.basename(__file__))


class TagProtoConverter(ProtoConverter):
    def from_model(self, value: ModelTag) -> pb.Tag:
        return value.to_pb()

    def to_model(self, proto_value: pb.Tag) -> ModelTag:
        return ModelTag.from_pb(proto_value)


class TagDbConverter(DbConverter):
    def from_model(self, value: ModelTag) -> str:
        return value.name

    def to_model(self, db_value: str) -> ModelTag:
        return ModelTag.from_name(db_value)


@InitModel(
    db_table='packages',
    proto_class=pb.Package,
)
@attr.s
class ModelPackage(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/packages/{package_id}`
    # E.g. `categories/1/packages/123`
    name = Attrib(
        type=str,
    )
    package_name = Attrib(
        type=str,
    )
    description = Attrib(
        type=str,
    )
    create_time = Attrib(
        type=datetime.datetime,
        proto_converter=LegacyDatetimeProtoConverter(),
    )
    update_time = Attrib(
        type=datetime.datetime,
        proto_converter=LegacyDatetimeProtoConverter(),
    )
    state = Attrib(
        type=int,
    )
    author_id = Attrib(
        type=int,
    )
    image_urls = Attrib(
        type=str,
        repeated=True,
    )
    tags = Attrib(
        type=ModelTag,
        proto_converter=TagProtoConverter(),
        db_converter=TagDbConverter(),
        repeated=True,
    )
    download_count = Attrib(
        type=int,
    )
