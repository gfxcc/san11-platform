import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.auths import Authenticator
from lib.user import User, Activity, Action
from lib.comment import Reply
from lib.exception import Unauthenticated


logger = logging.getLogger(os.path.basename(__file__))


class ReplyHandler:
    def create_reply(self, request, context):
        logger.info(
            f'In CreateReply: {request.reply.author_id}-> {request.reply.text}')
        authenticator = Authenticator.from_context(context)
        assert request.reply.author_id == authenticator.session.user.user_id

        reply = Reply.from_pb(request.reply)
        reply.create()

        return reply.to_pb()
    
    def delete_reply(self, request, context):
        logger.info(f'In DeleteReply: reply_id={request.reply_id}')
        reply = Reply.from_id(request.reply_id)
        authenticator = Authenticator.from_context(context)
        if not authenticator.canDeleteReply(reply):
            context.abort(code=255, details='权限不足')
        reply.delete()
        return san11_platform_pb2.Empty()

    def update_reply(self, request, context):
        logger.info(f'In UpdateReply: reply_id={request.reply.reply_id}')
        reply = Reply.from_id(request.reply.reply_id)
        # TODO: fix authentication
        try:
            authenticator = Authenticator.from_context(context)
        except Unauthenticated as err:
            context.abort(code=err.code, details=str(err))

        if request.reply.upvote_count:
            resource = f'reply_id:{reply.reply_id}'
            activity = Activity(
                authenticator.session.user.user_id, resource, Action.UPVOTE)
            if activity.isExist():
                # upvote from the same user will result as cancelling previous upvote
                activity.delete()
                reply.upvote_count -= 1
            else:
                # upvote_count from user may stale
                activity.create()
                reply.upvote_count += 1

        reply.update()
        return reply.to_pb()