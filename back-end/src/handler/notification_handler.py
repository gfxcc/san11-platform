import logging
import os
from typing import Iterable, List, Tuple

from handler.handler_context import HandlerContext
from handler.model.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)

from .model.model_notification import ModelNotification

logger = logging.getLogger(os.path.basename(__file__))


class NotificationHandler(HandlerBase):
    def list(self, list_options: ListOptions,
             handler_context: HandlerContext) -> Tuple[List[ModelNotification], str]:
        order_by = 'create_time desc' + \
            (f', {list_options.order_by}' if list_options.order_by else '')
        filter = 'unread = true' + \
            (f' AND {list_options.filter}' if list_options.filter else '')
        list_options.order_by = order_by
        list_options.filter = filter
        notifications, next_page_token = ModelNotification.list(list_options)
        return notifications, next_page_token

    def update(self,
               dest: ModelNotification,
               update_mask: FieldMask,
               handler_context) -> ModelNotification:
        notification: ModelNotification = merge_resource(
            ModelNotification.from_name(dest.name), dest, update_mask)
        notification.update(handler_context.user.user_id)
        return notification
