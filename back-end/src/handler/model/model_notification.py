from __future__ import annotations

import datetime
from typing import List, Tuple

import attr
from handler.model.base import Attrib, InitModel, ListOptions, ModelBase

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

    @classmethod
    def from_name(cls, name: str) -> ModelNotification:
        return super().from_name(name)

    @classmethod
    def list(cls, list_options: ListOptions) -> Tuple[List[ModelNotification], str]:
        return super().list(list_options)
