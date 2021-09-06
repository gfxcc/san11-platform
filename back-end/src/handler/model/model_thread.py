import attr
import datetime

from .base import ModelBase, Attrib, InitModel
from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now


@InitModel(
    db_table='threads',
    proto_class=pb.Thread,
)
@attr.s
class ModelThread(ModelBase):
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
