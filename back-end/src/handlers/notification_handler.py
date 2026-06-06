import logging
import os
from typing import Iterable, List, Tuple

from app.handler_context import HandlerContext
from core.models.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)
from repositories.resource_repository import repository_for

from models.model_notification import ModelNotification

logger = logging.getLogger(os.path.basename(__file__))


class NotificationHandler(HandlerBase):
    def __init__(self, notification_repository=None):
        self.notification_repository = (
            notification_repository or repository_for(ModelNotification))

    def list(self, list_options: ListOptions,
             handler_context: HandlerContext) -> Tuple[List[ModelNotification], str]:
        order_by = 'create_time desc' + \
            (f', {list_options.order_by}' if list_options.order_by else '')
        list_options.order_by = order_by
        notifications, next_page_token = self.notification_repository.list(list_options)
        return notifications, next_page_token

    def update(self,
               dest: ModelNotification,
               update_mask: FieldMask,
               handler_context) -> ModelNotification:
        notification: ModelNotification = merge_resource(
            self.notification_repository.get(dest.name), dest, update_mask)
        return self.notification_repository.update(
            notification, actor_info=handler_context.user.user_id)
