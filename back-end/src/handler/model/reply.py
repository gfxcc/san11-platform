import os
import logging
from typing import Iterable, List
from datetime import datetime, timezone
from typing import Iterable

from ..db import run_sql_with_param
from ..protos import san11_platform_pb2
from ..util.time_util import get_now, get_age
from .resource import ResourceMixin, ResourceView
from .activity import TrackLifecycle


logger = logging.getLogger(os.path.basename(__file__))


class Reply(ResourceMixin, TrackLifecycle):
    def __init__(self, reply_id: int, comment_id: int, create_time: datetime,
                 update_time: datetime, text: str, author_id: int,
                 upvote_count: int, parent: str) -> None:
        self.reply_id = reply_id
        self.comment_id = comment_id
        self.create_time = create_time.replace(tzinfo=timezone.utc) if create_time.tzinfo is None else create_time
        self.update_time = update_time.replace(tzinfo=timezone.utc) if update_time.tzinfo is None else update_time
        self.text = text
        self.author_id = author_id
        self.upvote_count = upvote_count
        self._parent = parent
    
    @property
    def name(self) -> str:
        if not self.id:
            raise ValueError('Reply is not ready/created. self.id is not available.')
        return f'{self.parent}/replies/{self.id}'
    
    # TODO: remove backfill logic
    @property
    def parent(self) -> str:
        return self._parent
    
    @parent.setter
    def parent(self, parent: str) -> None:
        sql = f'UPDATE {self.db_table()} SET parent=%(parent)s WHERE reply_id=%(resource_id)s'
        run_sql_with_param(sql, {
            'parent': parent,
            'resource_id': self.id
        })
        self._parent = parent
    # TODO: END

    @property
    def id(self) -> int:
        return self.reply_id
    
    @property
    def view(self) -> ResourceView:
        return ResourceView(
            name='',
            display_name='回复',
            description=self.text,
            image_url=None
        )
    
    @classmethod
    def db_table(cls) -> str:
        return 'replies'

    @classmethod
    def db_fields(cls) -> List[str]:
        return ['reply_id', 'comment_id', 'create_time', 'update_time', 'text',
                'author_id', 'upvote_count', 'parent']

    @classmethod
    def name_pattern(cls) -> str:
        return r'.+/replies/[0-9]+'
        
    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.Reply, parent: str):
        return cls(
            reply_id=pb_obj.reply_id,
            comment_id=pb_obj.comment_id,
            create_time=pb_obj.create_time or get_now(),
            update_time=pb_obj.update_time or get_now(),
            text=pb_obj.text,
            author_id=pb_obj.author_id,
            upvote_count=pb_obj.upvote_count,
            parent=parent
        )

    def to_pb(self) -> san11_platform_pb2.Reply:
        return san11_platform_pb2.Reply(
            comment_id=self.comment_id,
            reply_id=self.reply_id,
            create_time=get_age(self.create_time),
            update_time=get_age(self.update_time),
            text=self.text,
            author_id=self.author_id,
            upvote_count=self.upvote_count
        )
