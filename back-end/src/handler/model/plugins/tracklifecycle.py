import datetime
from enum import Enum
from typing import Mapping, Optional, Union

import attrs

from handler.model.base import (DatetimeAttrib, InitModel, IntAttrib,
                                LifecycleEventsBase, ModelBase, StrAttrib,
                                base_db, base_proto)
from handler.protos import san11_platform_pb2 as pb
from handler.util.time_util import get_now


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
    UNSUBSCRIBE = 15
    DISLIKE = 14
    # misc
    DOWNLOAD = 21
    COLLECT = 22

    @classmethod
    def from_pb(cls, pb_obj: pb.Action):
        return cls(pb_obj)

    def to_pb(self) -> pb.Action:
        return self.value


class TrackLifecycle(LifecycleEventsBase):
    '''
    Lifecyle activities on sub-class will tracked (persisted in DB).
    '''
    _create_action = Action.CREATE
    _update_action = Action.UPDATE
    _delete_action = Action.DELETE

    def create(self, parent: str, actor_info: Optional[Union[int, str]] = None):
        assert isinstance(
            self, ModelBase), 'Only subclass of ModelBase can be tracked'
        super().create(parent, actor_info)
        if actor_info:
            ModelActivity(name='',
                          create_time=get_now(),
                          action=self._create_action.value,
                          resource_name=self.name).create(parent=f'users/{actor_info}' if isinstance(actor_info, int) else actor_info)

    def update(self, update_update_time: bool = True, actor_info: Optional[Union[int, str]] = None):
        assert isinstance(
            self, ModelBase), 'Only subclass of ModelBase can be tracked'
        super().update(update_update_time, actor_info)
        if actor_info:
            ModelActivity(name='',
                          create_time=get_now(),
                          action=self._update_action.value,
                          resource_name=self.name).create(parent=f'users/{actor_info}' if isinstance(actor_info, int) else actor_info)

    def delete(self, actor_info: Optional[Union[int, str]]):
        assert isinstance(
            self, ModelBase), 'Only subclass of ModelBase can be tracked'
        super().delete(actor_info)
        if actor_info:
            ModelActivity(name='',
                          create_time=get_now(),
                          action=self._delete_action.value,
                          resource_name=self.name).create(parent=f'users/{actor_info}' if isinstance(actor_info, int) else actor_info)


@InitModel(
    db_table='activities',
    proto_class=pb.Activity,
)
@attrs.define
class ModelActivity(base_db.DbModel, base_proto.ProtoModelBase):
    # Resource name. It is `{parent}/activities/{resource_id}`
    # E.g. `users/123/activities/12345`
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
