import datetime

import attr
from handler.model.activity import TrackLifecycle

from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now
from .base import Attrib, InitModel, ModelBase


@InitModel(
    db_table='articles',
    proto_class=pb.Article,
)
@attr.s
class ModelArticle(ModelBase, TrackLifecycle):
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
