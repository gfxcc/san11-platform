from __future__ import annotations
import datetime
import logging
from handler.model.base.base_db import ListOptions
from handler.model.model_reply import ModelReply
from typing import Iterable
import attr

from ..protos import san11_platform_pb2 as pb
from handler.model.activity import TrackLifecycle
from handler.model.base.base import Attrib, InitModel, ModelBase
from handler.model.base.base_proto import LegacyDatetimeProtoConverter, ProtoConverter
from handler.util.time_util import get_now


@InitModel(
    db_table='comments',
    proto_class=pb.Comment,
)
@attr.s
class ModelComment(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/comments/{resource_id}`
    # E.g. `comments/123`, `categories/123/packages/456/comments/789`
    name = Attrib(
        type=str,
    )
    author_id = Attrib(
        type=int,
    )
    text = Attrib(
        type=str,
    )
    create_time = Attrib(
        type=datetime.datetime,
    )
    update_time = Attrib(
        type=datetime.datetime,
    )
    upvote_count = Attrib(
        type=int,
    )
    index = Attrib(
        type=int,
    )

    def to_pb(self) -> pb.Comment:
        proto = super(ModelComment, self).to_pb()
        replies, _ = ModelReply.list(ListOptions(parent=self.name, order_by='create_time'))
        getattr(proto, 'replies').extend([reply.to_pb() for reply in replies])
        return proto
