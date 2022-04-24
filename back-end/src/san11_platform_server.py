from __future__ import annotations

import argparse
import functools
import logging
import os
from concurrent import futures
from typing import Any, Callable

import grpc
from google.protobuf import message

import iam_util
from handler.activity_handler import ActivityHandler
from handler.admin_handler import AdminHandler
from handler.article_handler import ArticleHandler
from handler.binary_handler import BinaryHandler
from handler.comment_handler import CommentHandler
from handler.common.exception import *
from handler.general_handler import GeneralHandler
from handler.handler_context import HandlerContext
from handler.image_handler import ImageHandler
from handler.model.base import FieldMask, ListOptions
from handler.model.model_article import ModelArticle
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_notification import ModelNotification
from handler.model.model_package import ModelPackage
from handler.model.model_reply import ModelReply
from handler.model.model_subscription import ModelSubscription
from handler.model.model_tag import ModelTag
from handler.model.model_thread import ModelThread
from handler.model.model_user import (ModelUser, get_user_by_email,
                                      get_user_by_username, validate_email,
                                      validate_password, validate_username)
from handler.model.user import verify_code
from handler.notification_handler import NotificationHandler
from handler.package_handler import PackageHandler
from handler.protos import san11_platform_pb2 as pb
from handler.protos import san11_platform_pb2_grpc
from handler.reply_handler import ReplyHandler
from handler.subscription_handler import SubscriptionHandler
from handler.tag_handler import TagHandler
from handler.thread_handler import ThreadHandler
from handler.user_handler import UserHandler
from handler.util.name_util import ResourceName
from handler.util.resource_parser import find_resource
from handler.util.user_util import hash_password, is_email

logger = logging.getLogger(os.path.basename(__file__))


RpcFunc = Callable[[Any, Any, Any], Any]


def is_production() -> bool:
    return os.environ.get('PRODUCTION') == 'true'


def GrpcAbortOnExcep(func: RpcFunc):
    @functools.wraps(func)
    def wrapper(this, request: message.Message, context: grpc.ServicerContext):
        try:
            return func(this, request, HandlerContext.from_service_context(context))
        except Excep as err:
            logger.warning(err, exc_info=(not is_production()))
            logger.warning(f'context={context}')
            context.abort(code=err.code, details=err.message)
    return wrapper


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
        self.notification_handler = NotificationHandler()
        self.subscription_handler = SubscriptionHandler()
    #############
    # New model #
    #############
    # Article

    @GrpcAbortOnExcep
    @iam_util.assert_login
    def CreateArticle(self, request, context):
        return self.article_handler.create(
            request.parent,
            ModelArticle.from_pb(request.article),
            context).to_pb()

    @GrpcAbortOnExcep
    def GetArticle(self, request, context):
        return self.article_handler.get(request.name, context).to_pb()

    @GrpcAbortOnExcep
    def ListArticles(self, request, context):
        articles, next_page_token = self.article_handler.list(
            ListOptions.from_request(request),
            context,
        )
        return pb.ListArticlesResponse(
            articles=[article.to_pb() for article in articles],
            next_page_token=next_page_token,
        )

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('article.name')
    def UpdateArticle(self, request, context):
        return self.article_handler.update(
            ModelArticle.from_pb(request.article),
            FieldMask.from_pb(request.update_mask),
            context).to_pb()

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('name')
    def DeleteArticle(self, request, context):
        return self.article_handler.delete(ModelArticle.from_name(request.name), context).to_pb()

    # binaries
    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('parent')
    def CreateBinary(self, request, context):
        return self.binary_handler.create(
            request.parent,
            ModelBinary.from_pb(request.binary),
            context).to_pb()

    @GrpcAbortOnExcep
    def ListBinaries(self, request, context):
        binaries, next_page_token = self.binary_handler.list_binaries(
            request=request,
            handler_context=context,
        )
        return pb.ListBinariesResponse(
            binaries=[binary.to_pb() for binary in binaries],
            next_page_token=next_page_token,
        )

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('binary.name')
    def UpdateBinary(self, request, context):
        return self.binary_handler.update(ModelBinary.from_pb(request.binary),
                                          FieldMask.from_pb(
                                              request.update_mask),
                                          context).to_pb()

    @GrpcAbortOnExcep
    def DeleteBinary(self, request, context):
        return self.binary_handler.delete(request.name, context).to_pb()

    @GrpcAbortOnExcep
    def DownloadBinary(self, request, context):
        return self.binary_handler.download_binary(ModelBinary.from_name(request.name), context).to_pb()

    # Comments
    @GrpcAbortOnExcep
    @iam_util.assert_login
    def CreateComment(self, request, context):
        return self.comment_handler.create(
            request.parent,
            ModelComment.from_pb(request.comment), context).to_pb()

    @GrpcAbortOnExcep
    def ListComments(self, request, context):
        comments, next_page_token = self.comment_handler.list(
            list_options=ListOptions.from_request(request),
            handler_context=context,
        )
        return pb.ListCommentsResponse(
            comments=[comment.to_pb() for comment in comments],
            next_page_token=next_page_token,
        )

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('comment.name', bypass="set(request.update_mask.paths) <= {'upvote_count'}")
    def UpdateComment(self, request, context):
        return self.comment_handler.update(
            ModelComment.from_pb(request.comment),
            FieldMask.from_pb(request.update_mask),
            context).to_pb()

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('name')
    def DeleteComment(self, request, context):
        return self.comment_handler.delete(request.name, context).to_pb()

    # Reply
    @GrpcAbortOnExcep
    @iam_util.assert_login
    def CreateReply(self, request, context):
        return self.reply_handler.create(
            request.parent, ModelReply.from_pb(request.reply), context).to_pb()

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('reply.name', bypass="set(request.update_mask.paths) <= {'upvote_count'}")
    def UpdateReply(self, request, context):
        return self.reply_handler.update(
            ModelReply.from_pb(request.reply),
            FieldMask.from_pb(request.update_mask),
            context).to_pb()

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('name')
    def DeleteReply(self, request, context):
        return self.reply_handler.delete(request.name, context).to_pb()

    # Thread
    @GrpcAbortOnExcep
    @iam_util.assert_login
    def CreateThread(self, request, context):
        created_thread = self.thread_handler.create(
            request.parent, ModelThread.from_pb(request.thread), context)
        return created_thread.to_pb()

    @GrpcAbortOnExcep
    def GetThread(self, request, context):
        return self.thread_handler.get(request.name, context).to_pb()

    @GrpcAbortOnExcep
    def ListThreads(self, request, context):
        threads, next_page_token = self.thread_handler.list_threads(
            list_options=ListOptions.from_request(request),
            handler_context=context,
        )
        return pb.ListThreadsResponse(
            threads=[thread.to_pb() for thread in threads],
            next_page_token=next_page_token,
        )

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('thread.name')
    def UpdateThread(self, request, context):
        update_mask = FieldMask.from_pb(request.update_mask)
        thread = ModelThread.from_name(request.thread.name)
        if 'pinned' in update_mask.paths:
            if not context.user or not (context.user.is_admin() or
                                        find_resource(ResourceName.from_str(thread.name).parent).author_id == context.user.user_id):
                raise PermissionDenied()
        return self.thread_handler.update(ModelThread.from_pb(request.thread),
                                          update_mask,
                                          context).to_pb()

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('name')
    def DeleteThread(self, request, context):
        return self.thread_handler.delete(request.name, context).to_pb()

    @GrpcAbortOnExcep
    # TODO: Only allow a user list notifications send to that user.
    def ListNotifications(self, request, context):
        notifications, next_page_token = self.notification_handler.list(
            list_options=ListOptions.from_request(request),
            handler_context=context,
        )
        return pb.ListNotificationsResponse(
            notifications=[notification.to_pb()
                           for notification in notifications],
            next_page_token=next_page_token,
        )

    # @iam_util.assert_resource_owner('{notification.name}.receiver_id')
    @GrpcAbortOnExcep
    def UpdateNotification(self, request, context):
        return self.notification_handler.update(
            ModelNotification.from_pb(request.notification),
            FieldMask.from_pb(request.update_mask),
            context).to_pb()

    # Tags
    @GrpcAbortOnExcep
    @iam_util.assert_admin
    def CreateTag(self, request, context):
        return self.tag_handler.create(
            request.parent,
            ModelTag.from_pb(request.tag),
            context).to_pb()

    @GrpcAbortOnExcep
    @iam_util.assert_admin
    def DeleteTag(self, request, context):
        return self.tag_handler.delete(request.name, context).to_pb()

    @GrpcAbortOnExcep
    def ListTags(self, request, context):
        tags, next_page_token = self.tag_handler.list(
            list_options=ListOptions.from_request(request),
            handler_context=context,
        )
        return pb.ListTagsResponse(
            tags=[tag.to_pb() for tag in tags],
            next_page_token=next_page_token,
        )

    # package
    @GrpcAbortOnExcep
    @iam_util.assert_login
    def CreatePackage(self, request, context):
        return self.package_handler.create(
            request.parent, ModelPackage.from_pb(request.package), context).to_pb()

    @GrpcAbortOnExcep
    def GetPackage(self, request, context):
        return self.package_handler.get(request.name, context).to_pb()

    @GrpcAbortOnExcep
    def ListPackages(self, request, context):
        packages, next_page_token = self.package_handler.list(
            list_options=ListOptions.from_request(request),
            handler_context=context,
        )
        return pb.ListPackagesResponse(
            packages=[package.to_pb() for package in packages],
            next_page_token=next_page_token,
        )

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner(resource_name_path='package.name',
                                    bypass="set(request.update_mask.paths) <= {'like_count', 'dislike_count'}")
    def UpdatePackage(self, request, context):
        return self.package_handler.update(
            ModelPackage.from_pb(request.package),
            FieldMask.from_pb(
                request.update_mask),
            context).to_pb()

    @GrpcAbortOnExcep
    @iam_util.assert_admin
    def DeletePackage(self, request, context):
        return self.package_handler.delete(request.name, context).to_pb()

    @GrpcAbortOnExcep
    def SearchPackages(self, request, context):
        try:
            packages, next_page_token = self.package_handler.list(
                list_options=ListOptions(None, 100, 0, '', f'package_name = "*{request.query}*"'),
                handler_context=context,
            )
        except Excep as e:
            logger.warning(f'Failures encountered in SearchPackage, due to invalid input: {e}')
            return pb.SearchPackagesResponse()
        return pb.SearchPackagesResponse(packages=[package.to_pb() for package in packages])
        

    # activities
    @GrpcAbortOnExcep
    def ListActivities(self, request, context):
        activities, next_page_token = self.activity_handler.list(
            list_options=ListOptions.from_request(request),
            handler_context=context,
        )
        return pb.ListActivitiesResponse(
            activities=activities,
            next_page_token=next_page_token,
        )

    # Subscription
    @GrpcAbortOnExcep
    @iam_util.assert_login
    def CreateSubscriptioin(self, request, context):
        return self.subscription_handler.create(
            request.parent, ModelSubscription.from_pb(request.subscription), context).to_pb()

    @GrpcAbortOnExcep
    def ListSubscriptioins(self, request, context):
        subs, next_page_token = self.subscription_handler.list(
            list_options=ListOptions.from_request(request),
            handler_context=context,
        )
        return pb.ListSubscriptionsResponse(
            subscriptions=[subscription.to_pb() for subscription in subs],
            next_page_token=next_page_token,
        )

    @GrpcAbortOnExcep
    def UpdateSubscriptioin(self, request, context):
        return self.subscription_handler.update(
            ModelSubscription.from_pb(request),
            FieldMask.from_pb(request.update_mask),
            context).to_pb()

    @GrpcAbortOnExcep
    def DeleteSubscriptioin(self, request, context):
        return self.subscription_handler.delete(request.name,
                                                context).to_pb()

    @GrpcAbortOnExcep
    def UnSubscribe(self, request, context):
        self.subscription_handler.unsubscribe(
            request.subscribed_resource,
            request.subscriber_id,
            context)
        return pb.Status(code=0)

    # users
    @GrpcAbortOnExcep
    def CreateUser(self, request, context):
        parent, user = request.parent, ModelUser.from_pb(request.user)
        if not verify_code(user.email, request.verification_code):
            raise Unauthenticated(message='邮箱未经验证')
        user.hashed_password = hash_password(request.password)
        created_user, session = self.user_handler.create_user(
            parent, user, context)
        return pb.CreateUserResponse(
            user=created_user.to_pb(),
            sid=session.sid,
        )

    @GrpcAbortOnExcep
    def GetUser(self, request, context):
        return self.user_handler.get(request.name, context).to_pb()

    @GrpcAbortOnExcep
    def ListUsers(self, request, context):
        users, next_page_token = self.user_handler.list(
            list_options=ListOptions.from_request(request),
            handler_context=context,
        )
        return pb.ListUsersResponse(
            users=[user.to_pb() for user in users],
            next_page_token=next_page_token,
        )

    @GrpcAbortOnExcep
    @iam_util.assert_user('user.user_id')
    def UpdateUser(self, request, context):
        update_mask = FieldMask.from_pb(request.update_mask)
        # `password` has to be updated via API `UpdatePassword`
        update_mask.paths -= set('password')
        return self.user_handler.update(ModelUser.from_pb(request.user),
                                        update_mask, context).to_pb()

    @GrpcAbortOnExcep
    def SignIn(self, request, context):
        if is_email(request.identity):
            user = get_user_by_email(request.identity)
        else:
            user = get_user_by_username(request.identity)
        password = request.password
        user, sid = self.user_handler.sign_in(
            user, password, context)
        return pb.SignInResponse(
            user=user.to_pb(),
            sid=sid,
        )

    @GrpcAbortOnExcep
    def SignOut(self, request, context):
        # (TODO)
        return pb.Status(code=0, message='登出成功')

    @GrpcAbortOnExcep
    def UpdatePassword(self, request, context):
        update_user = ModelUser.from_name(request.name)
        # User may update password on following scenarios
        # 1. Update password while loged in.
        # 2. Fetch verification_code when password is forgot.
        if request.verification_code:
            if not verify_code(update_user.email, request.verification_code):
                raise Unauthenticated(message='验证码不正确')
        else:
            current_user = iam_util.load_user(context)
            if current_user.user_id != update_user.user_id:
                raise Unauthenticated()
        validate_password(request.password)

        update_user.hashed_password = hash_password(request.password)
        return self.user_handler.update(
            update_user, FieldMask({'hashed_password'}),
            context).to_pb()

    @GrpcAbortOnExcep
    def SendVerificationCode(self, request, context):
        self.user_handler.send_verification_code(request.email, context)
        return pb.Empty()

    @GrpcAbortOnExcep
    def VerifyEmail(self, request, context):
        ret = pb.VerifyEmailResponse()
        try:
            ok, user = self.user_handler.verify_email(
                request.email, request.verification_code, context)
            ret = pb.VerifyEmailResponse(
                ok=ok,
            )
            setattr(ret, 'ok', ok)
            if user:
                getattr(ret, 'user').CopyFrom(user.to_pb())
        except Unauthenticated as err:
            setattr(ret, 'ok', False)
        return ret

    @GrpcAbortOnExcep
    def ValidateNewUser(self, request, context):
        try:
            user = ModelUser.from_pb(request.user)
            if user.email:
                validate_email(user.email)
            if user.username:
                validate_username(user.username)
            return pb.Status(code=0, message='')
        except (AlreadyExists, InvalidArgument) as err:
            return pb.Status(code=err.code, message=err.message)

    #############
    # Old model #
    #############

    # image

    @GrpcAbortOnExcep
    @iam_util.assert_resource_owner('parent')
    def CreateImage(self, request, context):
        return self.image_handler.create_image(request, context)

    # general
    def GetStatistic(self, request, context):
        return self.general_handler.get_statistic(request, context)

    def GetAdminMessage(self, request, context):
        return self.admin_handler.get_admin_message(request, context)


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


def init_log(verbose: bool):
    FORMAT = '%(asctime)-15s %(levelname)s %(name)s:%(lineno)s [func=%(funcName)s] %(message)s'
    logging.basicConfig(
        level=logging.INFO if not verbose else logging.NOTSET,
        format=FORMAT,
        datefmt='%Y-%m-%d %H:%M:%S %Z')


def parse_args():
    parser = argparse.ArgumentParser(description='san11_platform main server')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='verbose mode')
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = parse_args()
    init_log(args.verbose)
    serve()
