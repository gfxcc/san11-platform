import datetime
from typing import Optional

import attr
from handler.model.activity import TrackLifecycle
from handler.model.base.base_db import ListOptions
from handler.model.model_comment import ModelComment

from ..protos import san11_platform_pb2 as pb
from .base import Attrib, InitModel, ModelBase


@InitModel(
    db_table='threads',
    proto_class=pb.Thread,
)
@attr.s
class ModelThread(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/threads/{thread_id}`
    # E.g. `threads/12345`
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
    comment_count = Attrib(
        type=int,
    )
    reply_count = Attrib(
        type=int,
    )
    latest_commented_time = Attrib(
        type=datetime.datetime,
    )
    latest_commenter_id = Attrib(
        type=int,
    )
    pinned = Attrib(
        type=bool,
    )
    create_time = Attrib(
        type=datetime.datetime,
    )
    update_time = Attrib(
        type=datetime.datetime,
    )

    def delete(self, user_id: Optional[int] = None) -> None:
        for comment in ModelComment.list(ListOptions(parent=self.name))[0]:
            comment.delete()
        super().delete(user_id=user_id)
