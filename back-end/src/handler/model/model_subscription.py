from __future__ import annotations

import datetime

import attr
from handler.model.base import Attrib, InitModel, ModelBase
from handler.model.model_activity import TrackLifecycle

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
        type=str,
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
