import datetime
from enum import Enum
from typing import Mapping, Optional

import attrs

from ..protos import san11_platform_pb2 as pb
from ..util.time_util import get_now
from .base import base_db, base_proto
from .base.base import Attrib, DatetimeAttrib, InitModel, IntAttrib, StrAttrib


class TrackLifecycle:
    '''
    Lifecyle activities on sub-class will tracked (persisted in DB).
    '''
    ...


class Action(Enum):
    UNDEFINED_ACTION = 0
    # resource
    CREATE = 1
    DELETE = 2
    UPDATE = 3
    SELECT = 4
    # social
    LIKE = 11
    UPVOTE = 12
    SUBSCRIBE = 13
    DISLIKE = 14
    # misc
    DOWNLOAD = 21
    COLLECT = 22

    @classmethod
    def from_pb(cls, pb_obj: pb.Action):
        return cls(pb_obj)

    def to_pb(self) -> pb.Action:
        return self.value


@InitModel(
    db_table='activities',
    proto_class=pb.Activity,
)
@attrs.define
class ModelActivity(base_db.DbModel, base_proto.ProtoModelBase):
    # Resource name. It is `{parent}/activities/{resource_id}`
    # E.g. `activities/12345`
    name: str = StrAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    action: int = IntAttrib()
    resource_name: str = StrAttrib(is_proto_field=False)


def search_activity(parent: str, action: Action, resource_name: str) -> Optional[ModelActivity]:
    activities = ModelActivity.list(
        base_db.ListOptions(parent=parent,
                            filter=f"action={action.value} AND resource_name=\"{resource_name}\"")
    )[0]
    if not activities:
        return None
    return activities[0]
