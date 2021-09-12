from operator import is_
import attr
import datetime
from typing import List

from .base import ModelBase, Attrib, InitModel
from .base import DatetimeProtoConverter
from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now


@InitModel(
    db_table='articles',
    proto_class=pb.Article,
)
@attr.s
class ModelArticle(ModelBase):
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

