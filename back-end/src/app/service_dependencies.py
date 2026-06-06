from __future__ import annotations

import attrs

from handlers.activity_handler import ActivityHandler
from handlers.admin_handler import AdminHandler
from handlers.article_handler import ArticleHandler
from handlers.binary_handler import BinaryHandler
from handlers.comment_handler import CommentHandler
from handlers.general_handler import GeneralHandler
from handlers.image_handler import ImageHandler
from handlers.notification_handler import NotificationHandler
from handlers.package_handler import PackageHandler
from handlers.reply_handler import ReplyHandler
from handlers.subscription_handler import SubscriptionHandler
from handlers.tag_handler import TagHandler
from handlers.thread_handler import ThreadHandler
from handlers.user_handler import UserHandler


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
