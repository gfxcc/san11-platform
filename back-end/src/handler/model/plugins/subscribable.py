import datetime
from typing import Iterable, List, Tuple

import attrs

from handler.common.exception import NotFound, PermissionDenied
from handler.util.name_util import ResourceName, get_parent
from handler.util.time_util import get_now

from ...protos import san11_platform_pb2 as pb
from ..base import (Attrib, BoolAttrib, DatetimeAttrib, InitModel, IntAttrib,
                    ListOptions, ModelBase, StrAttrib)
from ..base.common.list_options.list_options import MAX_PAGE_SIZE
from .tracklifecycle import Action, ModelActivity


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

    @classmethod
    def new(cls, target: str) -> 'ModelSubscription':
        return cls(name='', target=target,
                   create_time=get_now(), update_time=get_now())

    @property
    def subscriber_name(self) -> str:
        '''E.g. `users/123``'''
        return get_parent(self.name)


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

        sub = ModelSubscription.new(self.name)
        sub.create(parent=subscriber_name, actor_info=subscriber_name)
        self.subscriber_count += 1
        self.update(update_update_time=False)

        ModelActivity(name='', create_time=get_now(
        ), action=Action.SUBSCRIBE.value, resource_name=self.name).create(subscriber_name)

        return sub

    def unsubscribe(self, subscriber_name: str) -> None:
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

        ModelActivity(name='', create_time=get_now(
        ), action=Action.UNSUBSCRIBE.value, resource_name=self.name).create(subscriber_name)

    def list_subscriptions(self) -> Iterable[ModelSubscription]:
        '''
        Args:
            list_options: The list options to list subscriptions.
        '''
        assert isinstance(
            self, ModelBase), 'Only a `ModelBase` can subclass `Subscribable`'
        return ModelSubscription.list(ListOptions(
            parent=None, page_size=MAX_PAGE_SIZE, watermark=0, order_by='', filter=f'target="{self.name}"'))[0]


def list_subscriptions(target: str) -> Iterable[ModelSubscription]:
    '''
    A utility func to list all subscriptions against a specific target.
    '''
    subs = ModelSubscription.list(ListOptions(
        parent=None, page_size=MAX_PAGE_SIZE, watermark=0, order_by='', filter=f'target="{target}"'))[0]
    return subs
