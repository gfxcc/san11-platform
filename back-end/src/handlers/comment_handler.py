import logging
import os
from typing import List, Tuple

from app.handler_context import HandlerContext
from core.models.base import FieldMask, HandlerBase, merge_resource
from core.models.base import ListOptions
from models.model_comment import ModelComment
from models.model_reply import ModelReply
from models.model_thread import ModelThread
from models.model_user import ModelUser
from repositories.resource_repository import repository_for
from core.resources.name_util import ResourceName
from integrations.notifications.notifier import notify_on_creation
from core.resources.resource_parser import find_resource


logger = logging.getLogger(os.path.basename(__file__))


class CommentHandler(HandlerBase):
    def __init__(self, comment_repository=None, reply_repository=None,
                 thread_repository=None, user_repository=None):
        self.comment_repository = comment_repository or repository_for(ModelComment)
        self.reply_repository = reply_repository or repository_for(ModelReply)
        self.thread_repository = thread_repository or repository_for(ModelThread)
        self.user_repository = user_repository or repository_for(ModelUser)

    def create(self, parent: str, comment: ModelComment, handler_context: HandlerContext) -> ModelComment:
        user_id = handler_context.authenticated_user.user_id
        username = self.user_repository.get(f'users/{user_id}').username
        comment.author_id = user_id
        parent_obj = find_resource(parent)
        if isinstance(parent_obj, ModelThread):
            thread = parent_obj
            thread.comment_count += 1
            thread.latest_commented_time = comment.create_time
            thread.latest_commenter_id = user_id
            self.thread_repository.update(thread, update_update_time=False)
            comment.index = thread.comment_count
        self.comment_repository.create(
            parent=parent, resource=comment, actor_info=user_id)

        # Post creation
        notify_on_creation(comment)

        return comment

    def list(self, list_options: ListOptions,
             handler_context: HandlerContext) -> Tuple[List[ModelComment], str]:
        return self.comment_repository.list(list_options=list_options)

    def update(self, update_comment: ModelComment, update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelComment:
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'like_count', 'dislike_count'})
        comment = merge_resource(base_resource=self.comment_repository.get(update_comment.name),
                                 update_request=update_comment,
                                 field_mask=sanitized_update_mask)
        actor = handler_context.authenticated_user

        if update_mask.has('like_count'):
            comment.toggle_like(actor.name)

        is_visitor = True if set(update_mask.paths) <= {
            'like_count', 'dislike_count'} else False
        if is_visitor:
            self.comment_repository.update(comment, update_update_time=False)
        else:
            self.comment_repository.update(comment, actor_info=actor.name)
        return comment

    def delete(self, name: str, handler_context: HandlerContext) -> ModelComment:
        comment = self.comment_repository.get(name)
        parent = find_resource(ResourceName.from_str(name).parent)
        replies = self.reply_repository.list(ListOptions(parent=name))[0]
        if isinstance(parent, ModelThread):
            thread = parent
            thread.comment_count -= 1
            thread.reply_count -= len(replies)
            self.thread_repository.update(thread, update_update_time=False)
        return self.comment_repository.delete(
            comment, actor_info=handler_context.authenticated_user.user_id)
