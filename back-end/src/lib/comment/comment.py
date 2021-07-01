import os
import logging
from datetime import datetime, timezone
from typing import Iterable, List


from .reply import Reply
from ..protos import san11_platform_pb2
from ..db import run_sql_with_param, run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all
from ..time_util import get_now, datetime_to_str, get_timezone, get_age
from ..url import Url
from ..resource import ResourceMixin, ResourceView
from ..activity  import TrackLifecycle


logger = logging.getLogger(os.path.basename(__file__))


class Comment(ResourceMixin, TrackLifecycle):
    def __init__(self, comment_id: int, parent: str, create_time: datetime,
                 update_time: datetime, text: str, author_id: int, 
                 upvote_count: int) -> None:
        self.comment_id = comment_id
        self.parent = parent
        self.create_time = create_time.replace(tzinfo=timezone.utc) if create_time.tzinfo is None else create_time
        self.update_time = update_time.replace(tzinfo=timezone.utc) if update_time.tzinfo is None else update_time
        self.text = text
        self.author_id = author_id
        self.upvote_count = upvote_count
    
    @property
    def name(self) -> str:
        return f'{self.parent}/comments/{self.comment_id}'
    
    @property
    def id(self) -> int:
        return self.comment_id

    @property
    def view(self) -> ResourceView:
        return ResourceView(
            name='',
            display_name='评论',
            description=self.text,
            image_url=None
        )

    @classmethod
    def db_table(cls) -> str:
        return 'comments'

    @classmethod
    def db_fields(clS) -> List[str]:
        return ['comment_id', 'parent', 'create_time', 'update_time', 'text', 'author_id', 'upvote_count']

    @classmethod
    def name_pattern(cls) -> str:
        return r'.+/comments/[0-9]+'

    @classmethod
    def from_pb(cls, pb_obj:san11_platform_pb2.Comment):
        return cls(
            comment_id=pb_obj.comment_id,
            parent=pb_obj.parent,
            create_time=pb_obj.create_time or get_now(),
            update_time=pb_obj.update_time or get_now(),
            text=pb_obj.text,
            author_id=pb_obj.author_id,
            upvote_count=pb_obj.upvote_count
        )

    def delete(self, user_id: int) -> None:
        self._load_replies()
        for reply in self.replies:
            try:
                reply.delete(user_id=user_id)
            except Exception as err:
                logger.error(f'Failed to delete reply={reply} under comment={self}: {err}')
        super().delete()
    
    def to_pb(self) -> san11_platform_pb2.Comment:
        self._load_replies()
        return san11_platform_pb2.Comment(
            comment_id=self.comment_id,
            parent=self.parent,
            create_time=get_age(self.create_time),
            update_time=get_age(self.update_time),
            text=self.text,
            author_id=self.author_id,
            upvote_count=self.upvote_count,
            replies=[reply.to_pb() for reply in self.replies]
        )
    
    def _load_replies(self) -> None:
        self.replies = Reply.list(0, '', comment_id=self.comment_id)
        # TODO: remove backfill once it is done
        for reply in self.replies:
            if not reply.name:
                reply.name = f'{self.name}/replies/{reply.reply_id}'