from __future__ import annotations
import datetime
import attr

from ..protos import san11_platform_pb2 as pb
from handler.model.activity import TrackLifecycle
from handler.model.base.base import Attrib, InitModel, ModelBase


@InitModel(
    db_table='replies',
    proto_class=pb.Reply,
)
@attr.s
class ModelReply(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/replies/{resource_id}/`
    # E.g. `categories/123/packages/456/comments/789/replies/234`
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
