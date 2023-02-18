import datetime
from typing import List, Optional

import attrs
from google.protobuf import message

from handler.model.base import ListOptions
from handler.model.model_comment import ModelComment
from handler.model.plugins.tracklifecycle import TrackLifecycle

from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now
from .base import (Attrib, BoolAttrib, DatetimeAttrib, InitModel, IntAttrib,
                   ModelBase, StrAttrib, StrListAttrib)


@InitModel(
    db_table='articles',
    proto_class=pb.Article,
)
@attrs.define
class ModelArticle(TrackLifecycle, ModelBase):
    # Resource name. It is `{parent}/articles/{article_id}`
    # E.g. `articles/12345`
    name: str = StrAttrib()
    subject: str = StrAttrib()
    content: str = StrAttrib()
    author_id: int = IntAttrib()
    state: int = IntAttrib()
    tags: List[str] = StrListAttrib()
    view_count: int = IntAttrib()
    like_count: int = IntAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()

    def delete(self, actor_info: Optional[int] = None) -> None:
        for comment in ModelComment.list(ListOptions(parent=self.name))[0]:
            comment.delete()
        super().delete(actor_info=actor_info)

    @classmethod
    def from_name(cls, name: str) -> 'ModelArticle':
        return super().from_name(name)

    @classmethod
    def from_pb(cls, proto_model: message.Message) -> 'ModelArticle':
        return super().from_pb(proto_model)
