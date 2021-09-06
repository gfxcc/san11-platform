from handler.model.base.base_db import ListOptions
import handler
import os, attr, time
import logging
from typing import Iterable, Optional, Tuple

from .common.field_mask import FieldMask, merge_resource
from .model.model_thread import ModelThread
from .protos import san11_platform_pb2 as pb
from .auths import Authenticator
from .util import gcs


logger = logging.getLogger(os.path.basename(__file__))


class ThreadHandler:
    def create_thread(self, parent: str, thread: ModelThread, handler_context) -> ModelThread:
        thread.author_id = handler_context.user.user_id
        thread.state = pb.ResourceState.NORMAL
        thread.create(parent=parent, user_id=handler_context.user.user_id)
        return thread

    def get_thread(self, name: str, handler_context) -> ModelThread:
        thread = ModelThread.from_name(name)
        thread.view_count += 1
        thread.update(update_update_time=False)
        return thread

    def list_threads(self, request, handler_context) -> Tuple[Iterable[ModelThread], str]:
        time.sleep(5)
        list_options = ListOptions.from_request(request)
        order_by = 'pinned desc, create_time desc' + (f', {list_options.order_by}' if list_options.order_by else '') 
        list_options.order_by = order_by
        return ModelThread.list(list_options)

    def update_thread(self, update_thread: ModelThread, update_mask: FieldMask, handler_context) -> ModelThread:
        thread_original = ModelThread.from_name(update_thread.name)
        thread: ModelThread = merge_resource(
            thread_original, update_thread, update_mask)
        thread.update(handler_context.user.user_id)
        return thread

    def delete_thread(self, thread: ModelThread, handler_context) -> ModelThread:
        gcs.delete_folder(thread.name)        
        thread.delete(handler_context.user.user_id)
        return thread
