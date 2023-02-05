import datetime
from typing import Iterable, List, Tuple

import attrs

from handler.common.exception import NotFound, PermissionDenied
from handler.model.base import (Attrib, BoolAttrib, DatetimeAttrib, InitModel,
                                IntAttrib, ListOptions, ModelBase, StrAttrib)

from ...protos import san11_platform_pb2 as pb


@attrs.define
class Subscribable:
    subscriber_count: int = IntAttrib()

    def subscribe(self, subscriber_id: int):
        ...

    def unscribe(self, subscriber_id: int):
        ...


# @InitModel(
#     db_table='general_subscriptions',
#     proto_class=pb.Subscription,
# )
# @attrs.define
# class ModelSubscription(ModelBase):
#     # Resource name. It is `{parent}/subscriptions/{subscription_id}/`
#     # `parent` should be the resource name of the subscriber.
#     # E.g. `users/123/subscriptions/456`
#     name: str = StrAttrib()
#     artifact_name: str = StrAttrib()
#     create_time: datetime.datetime = DatetimeAttrib()
#     update_time: datetime.datetime = DatetimeAttrib()
#     type: int = IntAttrib()

#     def create(self, parent: str, user_id: int) -> None:
#         ret = super().create(parent, user_id, False)
#         ModelActivity(name='',
#                       create_time=get_now(),
#                       action=pb.Action.SUBSCRIBE,
#                       resource_name=parent).create(parent=f'users/{user_id}')
#         return ret
