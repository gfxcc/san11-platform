import datetime

import attrs

from handler.model.base import (Attrib, DatetimeAttrib, InitModel, IntAttrib,
                                ModelBase, StrAttrib)
from handler.model.plugins.tracklifecycle import TrackLifecycle
from handler.model.plugins.likeable import Likeable

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='replies',
    proto_class=pb.Reply,
)
@attrs.define
class ModelReply(Likeable, TrackLifecycle, ModelBase):
    # Resource name. It is `{parent}/replies/{resource_id}/`
    # E.g. `categories/123/packages/456/comments/789/replies/234`
    name: str = StrAttrib()
    author_id: int = IntAttrib()
    # TODO: rename to content
    text: str = StrAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()

    # Attributes for Likeable
    like_count: int = IntAttrib(
        # Migrated from `upvote_count`
        db_path='upvote_count')
    dislike_count: int = IntAttrib()

    @classmethod
    def from_name(cls, name: str) -> 'ModelReply':
        return super().from_name(name)

    @property
    def content(self) -> str:
        '''Alias for text. Prefer to use content instead of text.'''
        return self.text
