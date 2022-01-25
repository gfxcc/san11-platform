from __future__ import annotations

import datetime
import logging
import os
from typing import List, Optional, Tuple

import attr
from google.protobuf import message
from handler.common.exception import NotFound
from handler.model.base.base_db import ListOptions
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
        try:
            return ModelTag.from_name(db_value)
        except (NotFound, ValueError) as err:
            logger.error(f'A ModelTag might be deleted before removing all references: {err}')
            return ModelTag(name='', tag_name='', mutable=False)


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
    like_count = Attrib(
        type=int,
    )
    dislike_count = Attrib(
        type=int,
    )

    def delete(self, user_id: Optional[int] = None) -> None:
        return super().delete(user_id)

    @classmethod
    def from_pb(cls, proto_model: message.Message) -> ModelPackage:
        return super().from_pb(proto_model)

    @classmethod
    def from_name(cls, name: str) -> ModelPackage:
        return super().from_name(name)

    @classmethod
    def list(cls, list_options: ListOptions) -> Tuple[List[ModelPackage], str]:
        return super().list(list_options)

