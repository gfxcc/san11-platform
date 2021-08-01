from __future__ import annotations
import datetime
from handler.model.model_reply import ModelReply
from handler.model.reply import Reply
from typing import Iterable
from handler.model.comment import Comment
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

    def to_pb(self) -> pb.Comment:
        proto = super(ModelComment, self).to_pb()
        replies = ModelReply.list(parent=self.name)
        getattr(proto, 'replies').extend([reply.to_pb() for reply in replies])
        return proto

    @classmethod
    def from_legacy(cls, legacy_model: Comment) -> ModelComment:
        model = cls(
            name=legacy_model.name,
            author_id=legacy_model.author_id,
            text=legacy_model.text,
            create_time=legacy_model.create_time,
            update_time=legacy_model.update_time,
            upvote_count=legacy_model.upvote_count,
        )
        return model