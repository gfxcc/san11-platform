import logging
import os
from typing import Iterable, List, Tuple

from app.handler_context import HandlerContext
from core.models.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)
from models.model_article import ModelArticle
from models.model_package import ModelPackage
from models.model_user import ModelUser
from repositories.resource_repository import repository_for
from integrations.files.file_server import (BucketClass, FileServer, FileServerType,
                                      get_file_server)
from core.html_util import get_text_from_html
from integrations.notifications.notifier import notify_on_creation
from core.resources.resource_parser import find_resource
from core.resources.resource_view import ResourceViewVisitor

from models.model_thread import ModelThread
from app.protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class ThreadHandler(HandlerBase):
    def __init__(self, thread_repository=None):
        self.thread_repository = thread_repository or repository_for(ModelThread)

    def create(self, parent: str, thread: ModelThread, handler_context) -> ModelThread:
        thread.author_id = handler_context.authenticated_user.user_id
        thread.state = pb.ResourceState.NORMAL
        self.thread_repository.create(
            parent=parent, resource=thread, actor_info=handler_context.authenticated_user.user_id)

        # post creation actions
        notify_on_creation(thread)
        return thread

    def get(self, name: str, handler_context: HandlerContext) -> ModelThread:
        thread = self.thread_repository.get(name)
        thread.view_count += 1
        self.thread_repository.update(thread, update_update_time=False)
        return thread

    def list_threads(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelThread], str]:
        requested_order_by = list_options.order_by or 'create_time desc'
        list_options.order_by = f'pinned desc, {requested_order_by}'

        if not (handler_context.user and handler_context.user.is_admin()):
            normal_state_filter = f'state={pb.ResourceState.NORMAL}'
            list_options.filter = _merge_filters(
                list_options.filter, normal_state_filter)
        threads, next_page_token = self.thread_repository.list(list_options)
        return threads, next_page_token

    def update(self, update_thread: ModelThread, update_mask: FieldMask, handler_context) -> ModelThread:
        thread: ModelThread = merge_resource(
            self.thread_repository.get(update_thread.name), update_thread, update_mask)
        return self.thread_repository.update(
            thread, actor_info=handler_context.authenticated_user.user_id)

    def delete(self, name: str, handler_context: HandlerContext) -> ModelThread:
        thread = self.thread_repository.get(name)
        get_file_server(FileServerType.GCS).delete_by_prefix(
            BucketClass.REGULAR, thread.name)
        return self.thread_repository.delete(
            thread, actor_info=handler_context.authenticated_user.user_id)


def _merge_filters(existing_filter: str, required_filter: str) -> str:
    if not existing_filter:
        return required_filter
    return f'({existing_filter}) AND ({required_filter})'
