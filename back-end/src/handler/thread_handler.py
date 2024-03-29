import logging
import os
from typing import Iterable, List, Tuple

from handler.handler_context import HandlerContext
from handler.model.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)
from handler.model.model_article import ModelArticle
from handler.model.model_package import ModelPackage
from handler.model.model_user import ModelUser
from handler.util.file_server import (BucketClass, FileServer, FileServerType,
                                      get_file_server)
from handler.util.html_util import get_text_from_html
from handler.util.notifier import notify_on_creation
from handler.util.resource_parser import find_resource
from handler.util.resource_view import ResourceViewVisitor

from .model.model_thread import ModelThread
from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class ThreadHandler(HandlerBase):
    def create(self, parent: str, thread: ModelThread, handler_context) -> ModelThread:
        thread.author_id = handler_context.user.user_id
        thread.state = pb.ResourceState.NORMAL
        thread.create(parent=parent, actor_info=handler_context.user.user_id)

        # post creation actions
        notify_on_creation(thread)
        return thread

    def get(self, name: str, handler_context: HandlerContext) -> ModelThread:
        thread = ModelThread.from_name(name)
        thread.view_count += 1
        thread.update(update_update_time=False)
        return thread

    def list_threads(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelThread], str]:
        order_by = 'pinned desc, create_time desc' + \
            (f', {list_options.order_by}' if list_options.order_by else '')
        list_options.order_by = order_by
        if handler_context.user and handler_context.user.is_admin():
            list_options.filter = ''
        else:
            list_options.filter = 'state=1'
        threads, next_page_token = ModelThread.list(list_options)
        return threads, next_page_token

    def update(self, update_thread: ModelThread, update_mask: FieldMask, handler_context) -> ModelThread:
        thread: ModelThread = merge_resource(
            ModelThread.from_name(update_thread.name), update_thread, update_mask)
        thread.update(handler_context.user.user_id)
        return thread

    def delete(self, name: str, handler_context: HandlerContext) -> ModelThread:
        thread = ModelThread.from_name(name)
        get_file_server(FileServerType.GCS).delete_by_prefix(
            BucketClass.REGULAR, thread.name)
        thread.delete(handler_context.user.user_id)
        return thread
