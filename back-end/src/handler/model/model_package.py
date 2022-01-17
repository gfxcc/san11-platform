import datetime
import logging
import os
from pydoc import describe
from typing import Dict, Optional
from xml.dom.minidom import Attr

import attr
from handler.model.binary import Binary
from handler.model.model_tag import ModelTag
from handler.model.package import Package
from handler.model.tag import Tag

from ..protos import san11_platform_pb2 as pb
from ..util import gcs
from ..util.time_util import get_now
from .activity import TrackLifecycle
from .base import (Attrib, DbConverter, InitModel,
                   LegacyDatetimeProtoConverter, ModelBase, ProtoConverter)

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
        type=Tag,
        proto_converter=TagProtoConverter(),
        db_converter=TagDbConverter(),
        repeated=True,
    )
    download_count = Attrib(
        type=int,
    )

    @classmethod
    def from_v1(cls, legacy_model: Package):
        return cls(
            name=legacy_model.name,
            package_name=legacy_model.package_name,
            description=legacy_model.description,
            create_time=legacy_model.create_time,
            update_time=legacy_model.update_time,
            state=legacy_model.status.value,
            author_id=legacy_model.author_id,
            image_urls=legacy_model.image_urls,
            tags=[ModelTag.from_id(tag_id) for tag_id in legacy_model.tag_ids],
            download_count=legacy_model.download_count,
        )
