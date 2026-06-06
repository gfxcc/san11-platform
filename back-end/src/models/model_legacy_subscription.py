import datetime
import attrs

from core.errors.exceptions import NotFound
from core.models.base import (DatetimeAttrib, InitModel, IntAttrib,
                                ListOptions, ModelBase, StrAttrib)
from models.plugins.tracklifecycle import ModelActivity, TrackLifecycle
from core.time_util import get_now

from app.protos import san11_platform_pb2 as pb


@InitModel(
    db_table='subscriptions_legacy',
    proto_class=pb.LegacySubscription,
)
@attrs.define
class ModelLegacySubscription(TrackLifecycle, ModelBase):
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
        ret = super().create(parent, actor_info=None)
        from repositories.resource_repository import repository_for
        repository_for(ModelActivity).create(
            parent=f'users/{user_id}',
            resource=ModelActivity(name='',
                                   create_time=get_now(),
                                   action=pb.Action.SUBSCRIBE,
                                   resource_name=parent))
        return ret


def find_subscription(subscribed: str, subscriber_id: int) -> ModelLegacySubscription:
    from repositories.resource_repository import repository_for
    subscriptions = repository_for(ModelLegacySubscription).list(ListOptions(
        parent=subscribed, filter=f'subscriber_id={subscriber_id}'))[0]
    if not subscriptions:
        raise NotFound()
    return subscriptions[0]
