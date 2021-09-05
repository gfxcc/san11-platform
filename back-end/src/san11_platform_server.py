from __future__ import annotations
from handler import thread_handler
from handler.model.model_thread import ModelThread
from handler.thread_handler import ThreadHandler
from handler.model.model_reply import ModelReply
from handler.model.model_comment import ModelComment
from handler.util.resource_parser import ResourceName
from handler.model.package import Package
from handler.model.model_binary import ModelBinary
from handler.common.field_mask import FieldMask
import handler
from handler.model.article import Article
from handler.model.user import User
import os
import sys
import logging
import time
import re
import attr
import grpc

from typing import List, Optional
from concurrent import futures

from handler.protos import san11_platform_pb2_grpc
from handler.protos import san11_platform_pb2 as pb
from handler import PackageHandler, BinaryHandler, ImageHandler, \
    CommentHandler, ReplyHandler, UserHandler, \
    ActivityHandler, GeneralHandler, TagHandler, \
    AdminHandler, ArticleHandler
from handler.auths import Authenticator, Session
from handler.common.exception import *


logger = logging.getLogger(os.path.basename(__file__))


@attr.s(auto_attribs=True)
class HandlerContext:
    user: Optional[User]

    @classmethod
    def from_service_context(cls, service_context: grpc.ServicerContext) -> HandlerContext:
        session = None
        sid = dict(service_context.invocation_metadata()).get('sid', None)
        if not sid:
            return cls(user=None)
        session = Session.from_sid(sid)
        return cls(user=session.user)


class RouteGuideServicer(san11_platform_pb2_grpc.RouteGuideServicer):
    def __init__(self):
        self.package_handler = PackageHandler()
        self.binary_handler = BinaryHandler()
        self.image_handler = ImageHandler()
        self.comment_handler = CommentHandler()
        self.reply_handler = ReplyHandler()
        self.user_handler = UserHandler()
        self.activity_handler = ActivityHandler()
        self.general_handler = GeneralHandler()
        self.tag_handler = TagHandler()
        self.admin_handler = AdminHandler()
        self.article_handler = ArticleHandler()
        self.thread_handler = ThreadHandler()
    #############
    # New model #
    #############
    # Article
    def CreateArticle(self, request, context):
        parent, article = request.parent, Article.from_pb(request.article)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        created_article = self.article_handler.create_article(
            parent, article, handler_context)
        return created_article.to_pb()

    def GetArticle(self, request, context):
        name = request.name
        handler_context = HandlerContext.from_service_context(context)
        return self.article_handler.get_article(name, handler_context).to_pb()

    def ListArticles(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        articles, next_page_token = self.article_handler.list_articles(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListArticlesResponse(
            articles=[article.to_pb() for article in articles],
            next_page_token=next_page_token,
        )

    def UpdateArticle(self, request, context):
        article, update_mask = Article.from_pb(
            request.article), FieldMask.from_pb(request.update_mask)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == article.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.article_handler.update_article(article, update_mask, handler_context).to_pb()

    def DeleteArticle(self, request, context):
        article = Article.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == article.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.article_handler.delete_article(article, handler_context).to_pb()

    # binaries
    def CreateBinary(self, request, context):
        parent, binary = request.parent, ModelBinary.from_pb(request.binary)
        package = Package.from_name(parent)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == package.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        created_binary = self.binary_handler.create_binary(
            parent, binary, handler_context)
        return created_binary.to_pb()

    def ListBinaries(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        binaries, next_page_token = self.binary_handler.list_binaries(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListBinariesResponse(
            binaries=[binary.to_pb() for binary in binaries],
            next_page_token=next_page_token,
        )

    def UpdateBinary(self, request, context):
        binary, update_mask = ModelBinary.from_pb(
            request.binary), FieldMask.from_pb(request.update_mask)
        package = Package.from_name(str(ResourceName.from_str(binary.name).parent))
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == package.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.binary_handler.update_binary(binary, update_mask, handler_context).to_pb()

    def DeleteBinary(self, request, context):
        binary = ModelBinary.from_name(request.name)
        package = Package.from_name(str(ResourceName.from_str(binary.name).parent))
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == package.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.binary_handler.delete_binary(binary, handler_context).to_pb()

    def DownloadBinary(self, request, context):
        binary = ModelBinary.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        return self.binary_handler.download_binary(binary, handler_context).to_pb()

    # Comments
    def CreateComment(self, request, context):
        parent, comment = request.parent, ModelComment.from_pb(request.comment)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        created_comment = self.comment_handler.create_comment(
            parent, comment, handler_context)
        return created_comment.to_pb()

    def ListComments(self, request, context):
        parent, page_size, page_token = request.parent, request.page_size, request.page_token
        handler_context = HandlerContext.from_service_context(context)
        comments, next_page_token = self.comment_handler.list_comments(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListCommentsResponse(
            comments=[comment.to_pb() for comment in comments],
            next_page_token=next_page_token,
        )

    def UpdateComment(self, request, context):
        comment, update_mask = ModelComment.from_pb(request.comment), \
            FieldMask.from_pb(request.update_mask)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == comment.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.comment_handler.update_comment(comment, update_mask, handler_context).to_pb()

    def DeleteComment(self, request, context):
        comment = ModelComment.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == comment.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.comment_handler.delete_comment(comment, handler_context).to_pb()

    # Reply
    def CreateReply(self, request, context):
        parent, reply = request.parent, ModelReply.from_pb(request.reply)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        created_reply = self.reply_handler.create_reply(
            parent, reply, handler_context)
        return created_reply.to_pb()

    def UpdateReply(self, request, context):
        reply, update_mask = ModelReply.from_pb(request.reply), \
            FieldMask.from_pb(request.update_mask)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == reply.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.reply_handler.update_reply(reply, update_mask, handler_context).to_pb()

    def DeleteReply(self, request, context):
        reply = ModelReply.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == reply.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.reply_handler.delete_reply(reply, handler_context).to_pb()
    
    # Thread
    def CreateThread(self, request, context):
        parent, thread = request.parent, ModelThread.from_pb(request.thread)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        created_thread = self.thread_handler.create_thread(
            parent, thread, handler_context)
        return created_thread.to_pb()

    def GetThread(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        return self.thread_handler.get_thread(request.name, handler_context).to_pb()

    def ListThreads(self, request, context):
        handler_context = HandlerContext.from_service_context(context)
        threads, next_page_token = self.thread_handler.list_threads(
            request=request,
            handler_context=handler_context,
        )
        return pb.ListThreadsResponse(
            threads=[thread.to_pb() for thread in threads],
            next_page_token=next_page_token,
        )
    
    def UpdateThread(self, request, context):
        thread, update_mask = ModelThread.from_pb(request.thread), \
            FieldMask.from_pb(request.update_mask)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == thread.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.thread_handler.update_thread(thread, update_mask, handler_context).to_pb()

    def DeleteThread(self, request, context):
        thread = ModelThread.from_name(request.name)
        handler_context = HandlerContext.from_service_context(context)
        assert handler_context.user, '请登录'
        assert handler_context.user.user_id == thread.author_id or handler_context.user.user_type == 'admin', '权限验证失败'
        return self.thread_handler.delete_thread(thread, handler_context).to_pb()

    #############
    # Old model #
    #############

    def CreatePackage(self, request, context):
        return self.package_handler.create_package(request, context)

    def UpdatePackage(self, request, context):
        return self.package_handler.update_package(request, context)

    def GetPackage(self, request, context):
        return self.package_handler.get_package(request, context)

    def ListPackages(self, request, context):
        return self.package_handler.list_packages(request, context)

    def DeletePackage(self, request, context):
        return self.package_handler.delete_package(request, context)

    def SearchPackages(self, request, context):
        return self.package_handler.search_packages(request, context)

    # image
    def CreateImage(self, request, context):
        return self.image_handler.create_image(request, context)

    # users
    def SignUp(self, request, context):
        return self.user_handler.sign_up(request, context)

    def SignIn(self, request, context):
        return self.user_handler.sign_in(request, context)

    def SignOut(self, request, context):
        return self.user_handler.sign_out(request, context)

    def UpdateUser(self, request, context):
        return self.user_handler.update_user(request, context)

    def UpdatePassword(self, request, context):
        return self.user_handler.update_password(request, context)

    def GetUser(self, request, context):
        return self.user_handler.get_user(request, context)

    def ListUsers(self, request, context):
        return self.user_handler.list_users(request, context)

    def SendVerificationCode(self, request, context):
        return self.user_handler.send_verification_code(request, context)

    def VerifyEmail(self, request, context):
        return self.user_handler.verify_email(request, context)

    def VerifyNewUser(self, request, context):
        return self.user_handler.verify_new_user(request, context)

    # activities
    def ListActivities(self, request, context):
        return self.activity_handler.list_activities(request, context)

    # general
    def GetStatistic(self, request, context):
        return self.general_handler.get_statistic(request, context)

    def GetAdminMessage(self, request, context):
        return self.admin_handler.get_admin_message(request, context)

    # Tags
    def CreateTag(self, request, context):
        return self.tag_handler.create_tag(request, context)

    def DeleteTag(self, request, context):
        return self.tag_handler.delete_tag(request, context)

    def ListTags(self, request, context):
        return self.tag_handler.list_tags(request, context)


def serve():
    options = [('grpc.max_receive_message_length', 30 * 1024 * 1024)]  # 30 MB
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10),
                         options=options)
    san11_platform_pb2_grpc.add_RouteGuideServicer_to_server(
        RouteGuideServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    logging.info('Server started...')
    server.wait_for_termination()


def init_log():
    FORMAT = '%(asctime)-15s %(levelname)s %(name)s %(message)s'
    logging.basicConfig(level=logging.NOTSET, format=FORMAT)


if __name__ == '__main__':
    init_log()
    serve()
