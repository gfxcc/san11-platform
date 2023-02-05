import datetime

import attrs

from handler.model.base import (Attrib, DatetimeAttrib, InitModel, IntAttrib,
                                ModelBase, StrAttrib)
from handler.model.model_activity import TrackLifecycle

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='replies',
    proto_class=pb.Reply,
)
@attrs.define
class ModelReply(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/replies/{resource_id}/`
    # E.g. `categories/123/packages/456/comments/789/replies/234`
    name: str = StrAttrib()
    author_id: int = IntAttrib()
    text: str = StrAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()
    upvote_count: int = IntAttrib()

    @classmethod
    def from_name(cls, name: str) -> 'ModelReply':
        return super().from_name(name)
