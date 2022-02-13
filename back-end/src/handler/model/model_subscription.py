from __future__ import annotations

import datetime
from typing import List, Tuple

import attr
from handler.common.exception import NotFound
from handler.model.base import Attrib, InitModel, ModelBase
from handler.model.base.base_db import ListOptions
from handler.model.model_activity import ModelActivity, TrackLifecycle
from handler.util.time_util import get_now

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='subscriptions',
    proto_class=pb.Subscription,
)
@attr.s
class ModelSubscription(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/subscriptions/{subscription_id}/`
    # E.g. `users/123/subscriptions/456`
    name = Attrib(
        type=str,
    )
    subscriber_id = Attrib(
        type=int,
    )
    create_time = Attrib(
        type=datetime.datetime,
    )
    update_time = Attrib(
        type=datetime.datetime,
    )
    type = Attrib(
        type=int,
    )

    def create(self, parent: str, user_id: int) -> None:
        ret = super().create(parent, user_id, False)
        ModelActivity(name='',
                      create_time=get_now(),
                      action=pb.Action.SUBSCRIBE,
                      resource_name=parent).create(parent=f'users/{user_id}')
        return ret

    @classmethod
    def from_name(cls, name: str) -> ModelSubscription:
        return super().from_name(name)

    @classmethod
    def list(cls, list_options: ListOptions) -> Tuple[List[ModelSubscription], str]:
        return super().list(list_options)


def find_subscription(subscribed: str, subscriber_id: int) -> ModelSubscription:
    subscriptions = ModelSubscription.list(ListOptions(
        parent=subscribed, filter=f'subscriber_id={subscriber_id}'))[0]
    if not subscriptions:
        raise NotFound()
    return subscriptions[0]
