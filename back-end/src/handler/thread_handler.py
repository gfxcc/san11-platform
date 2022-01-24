import logging
import os
from typing import Iterable, Tuple

from handler.model.base import FieldMask, merge_resource
from handler.model.base.base_db import ListOptions
from handler.model.model_article import ModelArticle
from handler.model.model_package import ModelPackage
from handler.model.user import User
from handler.util import gcs
from handler.util.notifier import notify
from handler.util.resource_parser import find_resource

from .model.model_thread import ModelThread
from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class ThreadHandler:
    def create_thread(self, parent: str, thread: ModelThread, handler_context) -> ModelThread:
        thread.author_id = handler_context.user.user_id
        thread.state = pb.ResourceState.NORMAL
        thread.create(parent=parent, user_id=handler_context.user.user_id)

        # Send notification
        try:
            parent_obj = find_resource(parent)
            assert isinstance(parent_obj, ModelPackage) or isinstance(
                parent_obj, ModelArticle)
            notify(
                sender_id=thread.author_id,
                receiver_id=parent_obj.author_id,
                content=f'{User.from_id(thread.author_id).username} 评论了 {parent_obj.package_name if isinstance(parent_obj, ModelPackage) else parent_obj.subject}',
                link=thread.name,
                image_preview='',
            )
        except Exception as err:
            logger.warning(f'failed to notify user: {err}')
        return thread

    def get_thread(self, name: str, handler_context) -> ModelThread:
        thread = ModelThread.from_name(name)
        thread.view_count += 1
        thread.update(update_update_time=False)
        return thread

    def list_threads(self, request, handler_context) -> Tuple[Iterable[ModelThread], str]:
        list_options = ListOptions.from_request(request)
        order_by = 'pinned desc, create_time desc' + \
            (f', {list_options.order_by}' if list_options.order_by else '')
        list_options.order_by = order_by
        if handler_context.user and handler_context.user.is_admin():
            list_options.filter = ''
        else:
            list_options.filter = 'state=1'
        threads, next_page_token = ModelThread.list(list_options)
        return threads, next_page_token

    def update_thread(self, base_thread: ModelThread, update_thread: ModelThread, update_mask: FieldMask, handler_context) -> ModelThread:
        thread: ModelThread = merge_resource(
            base_thread, update_thread, update_mask)
        thread.update(handler_context.user.user_id)
        return thread

    def delete_thread(self, thread: ModelThread, handler_context) -> ModelThread:
        gcs.delete_folder(thread.name)
        thread.delete(handler_context.user.user_id)
        return thread
