import datetime
from typing import List, Optional, Tuple

import attrs

from core.models.base import ListOptions
from models.model_comment import ModelComment
from models.plugins.tracklifecycle import TrackLifecycle
from models.plugins.likeable import Likeable

from app.protos import san11_platform_pb2 as pb
from core.models.base import (Attrib, BoolAttrib, DatetimeAttrib, InitModel, IntAttrib,
                   ModelBase, StrAttrib, StrListAttrib)


@InitModel(
    db_table='threads',
    proto_class=pb.Thread,
)
@attrs.define
class ModelThread(Likeable, TrackLifecycle, ModelBase[pb.Thread]):
    # Resource name. It is `{parent}/threads/{thread_id}`
    # E.g. `threads/12345`
    name: str = StrAttrib()
    subject: str = StrAttrib()
    content: str = StrAttrib()
    author_id: int = IntAttrib()
    state: int = IntAttrib()
    tags: List[str] = StrListAttrib()
    latest_commented_time: datetime.datetime = DatetimeAttrib()
    latest_commenter_id: int = IntAttrib()
    pinned: bool = BoolAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()
    view_count: int = IntAttrib()
    comment_count: int = IntAttrib()
    reply_count: int = IntAttrib()

    # Attributes for Likeable
    like_count: int = IntAttrib()
    dislike_count: int = IntAttrib()

    def delete(self, actor_info: Optional[int] = None) -> None:
        from repositories.resource_repository import repository_for
        comment_repository = repository_for(ModelComment)
        for comment in comment_repository.list(ListOptions(parent=self.name))[0]:
            comment_repository.delete(comment)
        super().delete(actor_info=actor_info)
