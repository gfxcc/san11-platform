from __future__ import annotations

import datetime
from typing import Optional

import attr
from google.protobuf import message
from handler.model.base import ListOptions
from handler.model.model_activity import TrackLifecycle
from handler.model.model_comment import ModelComment

from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now
from .base import Attrib, InitModel, ModelBase


@InitModel(
    db_table='articles',
    proto_class=pb.Article,
)
@attr.s
class ModelArticle(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/articles/{article_id}`
    # E.g. `articles/12345`
    name = Attrib(
        type=str,
    )
    subject = Attrib(
        type=str,
    )
    content = Attrib(
        type=str,
    )
    author_id = Attrib(
        type=int,
    )
    state = Attrib(
        type=int,
    )
    tags = Attrib(
        type=str,
        repeated=True,
    )
    view_count = Attrib(
        type=int,
    )
    like_count = Attrib(
        type=int,
    )
    create_time = Attrib(
        type=datetime.datetime,
        default=get_now(),
    )
    update_time = Attrib(
        type=datetime.datetime,
        default=get_now(),
    )

    def update(self, update_update_time: bool = True, user_id: Optional[int] = None) -> None:
        return super().update(update_update_time, user_id)

    def delete(self, user_id: Optional[int] = None) -> None:
        for comment in ModelComment.list(ListOptions(parent=self.name))[0]:
            comment.delete()
        super().delete(user_id=user_id)

    @classmethod
    def from_name(cls, name: str) -> ModelArticle:
        return super().from_name(name)

    @classmethod
    def from_pb(cls, proto_model: message.Message) -> ModelArticle:
        return super().from_pb(proto_model)
