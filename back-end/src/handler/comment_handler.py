import logging
import os
from typing import List, Tuple

from handler.handler_context import HandlerContext
from handler.model.base import FieldMask, HandlerBase, merge_resource
from handler.model.base.base_db import ListOptions
from handler.model.model_comment import ModelComment
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser
from handler.util.name_util import ResourceName
from handler.util.notifier import notify_on_creation
from handler.util.resource_parser import find_resource


logger = logging.getLogger(os.path.basename(__file__))


class CommentHandler(HandlerBase):
    def create(self, parent: str, comment: ModelComment, handler_context: HandlerContext) -> ModelComment:
        user_id = handler_context.user.user_id
        username = ModelUser.from_name(f'users/{user_id}').username
        comment.author_id = user_id
        parent_obj = find_resource(parent)
        if isinstance(parent_obj, ModelThread):
            thread = parent_obj
            thread.comment_count += 1
            thread.latest_commented_time = comment.create_time
            thread.latest_commenter_id = user_id
            thread.update(update_update_time=False)
            comment.index = thread.comment_count
        comment.create(parent=parent, actor_info=user_id)

        # Post creation
        notify_on_creation(comment)

        return comment

    def list(self, list_options: ListOptions,
             handler_context: HandlerContext) -> Tuple[List[ModelComment], str]:
        return ModelComment.list(list_options=list_options)

    def update(self, update_comment: ModelComment, update_mask: FieldMask,
               handler_context: HandlerContext) -> ModelComment:
        sanitized_update_mask = FieldMask(
            set(update_mask.paths) - {'like_count', 'dislike_count'})
        comment = merge_resource(base_resource=ModelComment.from_name(update_comment.name),
                                 update_request=update_comment,
                                 field_mask=sanitized_update_mask)
        actor = handler_context.user

        if update_mask.has('like_count'):
            comment.toggle_like(actor.name)

        is_visitor = True if set(update_mask.paths) <= {
            'like_count', 'dislike_count'} else False
        if is_visitor:
            comment.update(update_update_time=False)
        else:
            comment.update(actor_info=actor.name)
        return comment

    def delete(self, name: str, handler_context: HandlerContext) -> ModelComment:
        comment = ModelComment.from_name(name)
        parent = find_resource(ResourceName.from_str(name).parent)
        replies = ModelReply.list(ListOptions(parent=name))[0]
        if isinstance(parent, ModelThread):
            thread = parent
            thread.comment_count -= 1
            thread.reply_count -= len(replies)
            thread.update(update_update_time=False)
        comment.delete(actor_info=handler_context.user.user_id)
        return comment
