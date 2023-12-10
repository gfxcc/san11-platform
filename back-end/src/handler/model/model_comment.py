import datetime
from typing import Optional

import attrs

from handler.model.base import (Attrib, DatetimeAttrib, InitModel, IntAttrib,
                                ListOptions, ModelBase, StrAttrib)
from handler.model.model_reply import ModelReply
from handler.model.plugins.tracklifecycle import TrackLifecycle
from handler.model.plugins.likeable import Likeable

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='comments',
    proto_class=pb.Comment,
)
@attrs.define
class ModelComment(Likeable, TrackLifecycle, ModelBase):
    # Resource name. It is `{parent}/comments/{resource_id}`
    # E.g. `comments/123`, `categories/123/packages/456/comments/789`
    name: str = StrAttrib()
    author_id: int = IntAttrib()
    # TODO: rename to content
    text: str = StrAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()
    index: int = IntAttrib()

    # Attributes for Likeable.
    like_count: int = IntAttrib(
        # Migrated from `upvote_count`
        db_path='upvote_count')
    dislike_count: int = IntAttrib()

    def to_pb(self) -> pb.Comment:
        proto = super(ModelComment, self).to_pb()
        replies, _ = ModelReply.list(ListOptions(
            parent=self.name, order_by='create_time'))
        getattr(proto, 'replies').extend([reply.to_pb() for reply in replies])
        return proto

    def delete(self, actor_info: Optional[int] = None) -> None:
        for reply in ModelReply.list(ListOptions(parent=self.name))[0]:
            reply.delete()
        super().delete(actor_info=actor_info)

    @property
    def content(self) -> str:
        '''Alias for text. Prefer to use content instead of text.'''
        return self.text

    @classmethod
    def from_name(cls, name: str) -> 'ModelComment':
        return super().from_name(name)
