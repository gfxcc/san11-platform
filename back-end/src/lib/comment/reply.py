import os
import logging
from typing import Iterable, List
from datetime import datetime, timezone
from typing import Iterable

from ..db import run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all, \
    get_db_fields_placeholder_str, get_db_fields_str, run_sql_with_param
from ..protos import san11_platform_pb2
from ..time_util import get_now, datetime_to_str, get_age
from ..resource import ResourceMixin, ResourceView
from ..activity import TrackLifecycle


logger = logging.getLogger(os.path.basename(__file__))


class Reply(ResourceMixin, TrackLifecycle):
    def __init__(self, reply_id: int, comment_id: int, create_time: datetime,
                 update_time: datetime, text: str, author_id: int,
                 upvote_count: int, name: str=None) -> None:
        self.reply_id = reply_id
        self.comment_id = comment_id
        self.create_time = create_time.replace(tzinfo=timezone.utc)
        self.update_time = update_time.replace(tzinfo=timezone.utc)
        self.text = text
        self.author_id = author_id
        self.upvote_count = upvote_count
        self._name = name
    
    @property
    def name(self) -> str:
        return self._name
    
    @name.setter
    def name(self, name: str) -> None:
        '''
        TODO: Only for backfill. Should be removed once it is done.
        '''
        sql = f'UPDATE {self.db_table()} SET name=%(name)s WHERE reply_id=%(reply_id)s'
        run_sql_with_param(sql, {
            'name': name,
            'reply_id': self.reply_id
        })
    
    @property
    def id(self) -> int:
        return self.reply_id
    
    @property
    def view(self) -> ResourceView:
        ResourceView(
            name=self.name,
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
                'author_id', 'upvote_count', 'name']

    @classmethod
    def name_pattern(cls) -> str:
        return r'.+/replies/[0-9]+'
        
    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.Reply):
        return cls(
            reply_id=pb_obj.reply_id,
            comment_id=pb_obj.comment_id,
            create_time=pb_obj.create_time or get_now(),
            update_time=pb_obj.update_time or get_now(),
            text=pb_obj.text,
            author_id=pb_obj.author_id,
            upvote_count=pb_obj.upvote_count
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
