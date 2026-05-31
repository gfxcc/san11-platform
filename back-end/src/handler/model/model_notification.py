import datetime
import attrs

from handler.model.base import (Attrib, BoolAttrib, DatetimeAttrib, InitModel,
                                IntAttrib, ModelBase, StrAttrib)

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='notifications',
    proto_class=pb.Notification,
)
@attrs.define
class ModelNotification(ModelBase):
    # Resource name. It is `{parent}/notifications/{resource_id}`
    # E.g. `notifications/123`
    name: str = StrAttrib()
    sender_id: int = IntAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()
    content: str = StrAttrib()
    image_preview: str = StrAttrib()
    link: str = StrAttrib()
    unread: bool = BoolAttrib(default=True)
