from datetime import datetime
import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.auths import Authenticator
from lib.user import User
from lib.activity import Activity, Action
from lib.comment import Reply
from lib.exception import Unauthenticated, NotFound
from lib.time_util import get_now


logger = logging.getLogger(os.path.basename(__file__))


class ReplyHandler:
    def create_reply(self, request, context):
        logger.info(
            f'In CreateReply: {request.reply.author_id}-> {request.reply.text}')
        auth = Authenticator.from_context(context)
        assert request.reply.author_id == auth.session.user.user_id

        reply = Reply.from_pb(request.reply)
        reply.create(user_id=auth.session.user.user_id)

        return reply.to_pb()
    
    def delete_reply(self, request, context):
        logger.info(f'In DeleteReply: reply_id={request.reply_id}')
        reply = Reply.from_id(request.reply_id)
        auth = Authenticator.from_context(context)
        if not auth.canDeleteReply(reply):
            context.abort(code=255, details='权限不足')
        reply.delete(user_id=auth.session.user.user_id)
        return san11_platform_pb2.Empty()

    def update_reply(self, request, context):
        logger.info(f'In UpdateReply: reply_id={request.reply.reply_id}')
        reply = Reply.from_id(request.reply.reply_id)
        # TODO: fix authentication
        try:
            auth = Authenticator.from_context(context)
        except Unauthenticated as err:
            context.abort(code=err.code, details=str(err))

        if request.reply.upvote_count:
            try:
                activity = Activity.from_detail(
                    user_id=auth.session.user.user_id, action=Action.UPVOTE, resource_name=reply.name)
            except NotFound as err:
                Activity(activity_id=0, user_id=auth.session.user.user_id,
                         create_time=get_now(),
                         action=Action.UPVOTE, resource_name=reply.name).create()
                reply.upvote_count += 1
            else:
                # upvote from the same user will result as cancelling previous upvote
                activity.delete()
                reply.upvote_count -= 1

        reply.update(user_id=auth.session.user.user_id)
        return reply.to_pb()