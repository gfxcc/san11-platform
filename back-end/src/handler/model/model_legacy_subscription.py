import datetime
from typing import List, Tuple

import attrs

from handler.common.exception import NotFound
from handler.model.base import (Attrib, BoolAttrib, DatetimeAttrib, InitModel,
                                IntAttrib, ListOptions, ModelBase, StrAttrib)
from handler.model.model_activity import ModelActivity, TrackLifecycle
from handler.util.time_util import get_now

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='subscriptions_legacy',
    proto_class=pb.LegacySubscription,
)
@attrs.define
class ModelLegacySubscription(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/subscriptions/{subscription_id}/`
    # E.g. `users/123/subscriptions/456`
    name: str = StrAttrib()
    subscriber_id: int = IntAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()
    type: int = IntAttrib()
    test_attr: int = attrs.field(metadata={
                                 'PROTO_MODEL_DB__IS_PROTO_FIELD': False, 'PROTO_MODEL_DB__IS_DB_FIELD': False}, default=1)

    def create(self, parent: str, user_id: int) -> None:
        ret = super().create(parent, user_id, False)
        ModelActivity(name='',
                      create_time=get_now(),
                      action=pb.Action.SUBSCRIBE,
                      resource_name=parent).create(parent=f'users/{user_id}')
        return ret

    @classmethod
    def from_name(cls, name: str) -> 'ModelLegacySubscription':
        return super().from_name(name)

    @classmethod
    def list(cls, list_options: ListOptions) -> Tuple[List['ModelLegacySubscription'], str]:
        return super().list(list_options)


def find_subscription(subscribed: str, subscriber_id: int) -> ModelLegacySubscription:
    subscriptions = ModelLegacySubscription.list(ListOptions(
        parent=subscribed, filter=f'subscriber_id={subscriber_id}'))[0]
    if not subscriptions:
        raise NotFound()
    return subscriptions[0]
