import datetime
import logging
import os
from typing import List, Optional, Tuple

import attrs
from google.protobuf import message

from handler.common.exception import NotFound
from handler.model.base import ListOptions
from handler.model.model_tag import ModelTag

from ..protos import san11_platform_pb2 as pb
from .base import (Attrib, DatetimeAttrib, DbConverter, InitModel, IntAttrib,
                   LegacyDatetimeProtoConverter, ModelBase, ProtoConverter,
                   StrAttrib, StrListAttrib)
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
            logger.error(
                f'A ModelTag might be deleted before removing all references: {err}')
            return ModelTag(name='', tag_name='', mutable=False)


@InitModel(
    db_table='packages',
    proto_class=pb.Package,
)
@attrs.define
class ModelPackage(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/packages/{package_id}`
    # E.g. `categories/1/packages/123`
    name: str = StrAttrib()
    package_name: str = StrAttrib()
    description: str = StrAttrib()
    create_time: datetime.datetime = DatetimeAttrib(
        proto_converter=LegacyDatetimeProtoConverter(),
    )
    update_time: datetime.datetime = DatetimeAttrib(
        proto_converter=LegacyDatetimeProtoConverter(),
    )
    state: int = IntAttrib()
    author_id: int = IntAttrib()
    image_urls: List[str] = StrListAttrib()
    tags: ModelTag = Attrib(
        proto_converter=TagProtoConverter(),
        db_converter=TagDbConverter(),
        repeated=True,
    )
    download_count: int = IntAttrib()
    like_count: int = IntAttrib()
    dislike_count: int = IntAttrib()

    def delete(self, user_id: Optional[int] = None) -> None:
        return super().delete(user_id)

    @classmethod
    def from_pb(cls, proto_model: message.Message) -> 'ModelPackage':
        return super().from_pb(proto_model)

    @classmethod
    def from_name(cls, name: str) -> 'ModelPackage':
        return super().from_name(name)

    @classmethod
    def list(cls, list_options: ListOptions) -> Tuple[List['ModelPackage'], str]:
        return super().list(list_options)
