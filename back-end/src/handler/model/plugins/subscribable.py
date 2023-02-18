import datetime
from typing import Iterable, List, Tuple

import attrs

from handler.common.exception import NotFound, PermissionDenied
from handler.model.base import (Attrib, BoolAttrib, DatetimeAttrib, InitModel,
                                IntAttrib, ListOptions, ModelBase, StrAttrib)

from ...protos import san11_platform_pb2 as pb


@InitModel(
    db_table='subscriptions',
    proto_class=pb.Subscription,
)
@attrs.define
class ModelSubscription(ModelBase):
    # Resource name. It is `{parent}/subscriptions/{subscription_id}/`
    # `parent` should be the resource name of the subscriber.
    # E.g. `users/123/subscriptions/456`
    name: str = StrAttrib()
    target: str = StrAttrib()
    create_time: datetime.datetime = DatetimeAttrib()
    update_time: datetime.datetime = DatetimeAttrib()


@attrs.define
class Subscribable:
    '''
    A sub-class must contains an IntAttrib named as `subscriber_count`.
    '''
    subscriber_count: int = IntAttrib()

    def subscribe(self, subscriber_name: str) -> ModelSubscription:
        '''
        Args:
            subscriber_name: The name of the actor which subscribe to this subscibable.
        '''
        assert isinstance(
            self, ModelBase), 'Only a `ModelBase` can subclass `Subscribable`'
        try:
            sub = ModelSubscription.find(
                subscriber_name, filter=f'target = "{self.name}"')  # type: ignore
        except NotFound:
            pass
        else:
            # Already subscribed. Return the existing subscription.
            return sub

        sub = ModelSubscription(target=self.name)
        sub.create(parent=subscriber_name, actor_info=subscriber_name)
        self.subscriber_count += 1
        self.update(update_update_time=False)
        return sub

    def unscribe(self, subscriber_name: str) -> None:
        '''
        Args:
            subscriber_name: The name of the actor which unsubscribe to this subscibable.
        '''
        assert isinstance(
            self, ModelBase), 'Only a `ModelBase` can subclass `Subscribable`'
        try:
            sub: ModelSubscription = ModelSubscription.find(
                subscriber_name, filter=f'target = "{self.name}"')  # type: ignore
        except NotFound:
            # No-op as there is not an existing match subscription.
            return
        else:
            pass

        sub.delete(actor_info=subscriber_name)
        self.subscriber_count -= 1
        self.update(update_update_time=False)
