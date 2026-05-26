from __future__ import annotations

import attrs

from handler.activity_handler import ActivityHandler
from handler.admin_handler import AdminHandler
from handler.article_handler import ArticleHandler
from handler.binary_handler import BinaryHandler
from handler.comment_handler import CommentHandler
from handler.general_handler import GeneralHandler
from handler.image_handler import ImageHandler
from handler.notification_handler import NotificationHandler
from handler.package_handler import PackageHandler
from handler.reply_handler import ReplyHandler
from handler.subscription_handler import SubscriptionHandler
from handler.tag_handler import TagHandler
from handler.thread_handler import ThreadHandler
from handler.user_handler import UserHandler


@attrs.define(auto_attribs=True)
class San11PlatformDependencies:
    package_handler: PackageHandler
    binary_handler: BinaryHandler
    image_handler: ImageHandler
    comment_handler: CommentHandler
    reply_handler: ReplyHandler
    user_handler: UserHandler
    activity_handler: ActivityHandler
    general_handler: GeneralHandler
    tag_handler: TagHandler
    admin_handler: AdminHandler
    article_handler: ArticleHandler
    thread_handler: ThreadHandler
    notification_handler: NotificationHandler
    subscription_handler: SubscriptionHandler

    @classmethod
    def create(cls) -> San11PlatformDependencies:
        return cls(
            package_handler=PackageHandler(),
            binary_handler=BinaryHandler(),
            image_handler=ImageHandler(),
            comment_handler=CommentHandler(),
            reply_handler=ReplyHandler(),
            user_handler=UserHandler(),
            activity_handler=ActivityHandler(),
            general_handler=GeneralHandler(),
            tag_handler=TagHandler(),
            admin_handler=AdminHandler(),
            article_handler=ArticleHandler(),
            thread_handler=ThreadHandler(),
            notification_handler=NotificationHandler(),
            subscription_handler=SubscriptionHandler(),
        )
