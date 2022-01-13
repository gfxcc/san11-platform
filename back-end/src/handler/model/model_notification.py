from __future__ import annotations

import datetime

import attr
from handler.model.base.base import Attrib, InitModel, ModelBase

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='notifications',
    proto_class=pb.Notification,
)
@attr.s
class ModelNotification(ModelBase):
    # Resource name. It is `{parent}/notifications/{resource_id}`
    # E.g. `notifications/123`
    name = Attrib(
        type=str,
    )
    sender_id = Attrib(
        type=int,
    )
    create_time = Attrib(
        type=datetime.datetime,
    )
    update_time = Attrib(
        type=datetime.datetime,
    )
    content = Attrib(
        type=str,
    )
    image_preview = Attrib(
        type=str,
    )
    link = Attrib(
        type=str,
    )
    unread = Attrib(
        type=bool,
        default=True,
    )

