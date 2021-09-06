from datetime import datetime
from handler.model.model_thread import ModelThread
from handler.util.resource_parser import ResourceName, parse_resource_name
from handler.common.field_mask import FieldMask, merge_resource
from handler.model.model_reply import ModelReply
import sys, os
import logging


from .protos import san11_platform_pb2
from .auths import Authenticator
from .model.user import User
from .model.activity import Activity, Action
from .model.comment import Reply, Comment
from .common.exception import InvalidArgument, Unauthenticated, NotFound
from .util.time_util import get_now


logger = logging.getLogger(os.path.basename(__file__))


class ReplyHandler:
    def create_reply(self, parent: str, reply: ModelReply,
                       handler_context) -> ModelReply:
        user_id = handler_context.user.user_id
        reply.author_id = user_id

        try:
            parent_name = ResourceName.from_str(parent)
            if parent_name.parent and parent_name.parent.collection == 'threads':
                thread: ModelThread = parse_resource_name(
                    str(parent_name.parent))
                thread.reply_count += 1
                thread.latest_commented_time = reply.create_time
                thread.latest_commenter_id = user_id
                thread.update(update_update_time=False)
        except InvalidArgument as e:
            logger.error(f'Failed to update thread during a reply creation: {e}')
            pass

        reply.create(parent=parent, user_id=user_id)
        return reply
    
    def update_reply(self, reply: ModelReply, update_mask: FieldMask,
                       handler_context) -> ModelReply:
        base_reply = ModelReply.from_name(reply.name)
        reply = merge_resource(base_resource=base_reply,
                                 update_request=reply,
                                 field_mask=update_mask)
        reply.upvote_count = base_reply.upvote_count
        user_id = handler_context.user.user_id
        if update_mask.has('upvote_count'):
            try:
                activity = Activity.from_detail(
                    user_id=user_id, action=Action.UPVOTE, resource_name=reply.name)
            except NotFound as err:
                Activity(activity_id=0, user_id=user_id,
                         create_time=get_now(),
                         action=Action.UPVOTE, resource_name=reply.name).create()
                reply.upvote_count += 1
            else:
                # upvote from the same user will result as cancelling previous upvote
                activity.delete()
                reply.upvote_count -= 1

        reply.update(user_id=user_id)
        return reply

    def delete_reply(self, reply: ModelReply,
                       handler_context) -> ModelReply:
        reply.delete(user_id=handler_context.user.user_id)
        return reply
