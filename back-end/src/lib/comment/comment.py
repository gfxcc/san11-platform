import os
import logging
from datetime import datetime, timezone
from typing import Iterable


from .reply import Reply
from ..protos import san11_platform_pb2
from ..db import run_sql_with_param, run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all
from ..time_util import get_now, datetime_to_str, get_timezone
from ..url import Url
from ..user.activity import Action, Activity


logger = logging.getLogger(os.path.basename(__file__))


class Comment:
    def __init__(self, parent: str, comment_id: int, create_time: datetime,
                 update_time: datetime, text: str, author_id: int, 
                 upvote_count: int) -> None:
        self.parent = parent
        self.comment_id = comment_id
        self.create_time = create_time.replace(tzinfo=timezone.utc)
        self.update_time = update_time.replace(tzinfo=timezone.utc)
        self.text = text
        self.author_id = author_id
        self.upvote_count = upvote_count
        self.replies = Reply.list_replies(self.comment_id)
    
    def __str__(self) -> str:
        return f'{{comment_id: {self.comment_id}, text: {self.text}, author_id: {self.author_id} }}'

    @classmethod
    def from_pb(cls, pb_obj:san11_platform_pb2.Comment):
        return cls(
            parent=pb_obj.parent,
            comment_id=pb_obj.comment_id,
            create_time=pb_obj.create_time or get_now(),
            update_time=pb_obj.update_time or get_now(),
            text=pb_obj.text,
            author_id=pb_obj.author_id,
            upvote_count=pb_obj.upvote_count
        )
    
    @classmethod
    def from_id(cls, comment_id: int):
        sql = f'SELECT {cls._db_fields()} FROM comments WHERE comment_id=%(comment_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'comment_id': comment_id
        })
        return cls(*resp)
    
    @classmethod
    def list_comment(cls, parent: str) -> Iterable:
        sql = f'SELECT {cls._db_fields()} FROM comments WHERE parent=%(parent)s ORDER BY create_time DESC'
        resp = run_sql_with_param_and_fetch_all(sql, {
            'parent': parent
        })
        comments = (cls(*item) for item in resp)
        return comments

    def to_pb(self) -> san11_platform_pb2.Comment:
        logger.debug(f'{self.create_time} -> {datetime_to_str(self.create_time)}')
        return san11_platform_pb2.Comment(
            parent=self.parent,
            comment_id=self.comment_id,
            create_time=datetime_to_str(self.create_time),
            update_time=datetime_to_str(self.update_time),
            text=self.text,
            author_id=self.author_id,
            upvote_count=self.upvote_count,
            replies=[reply.to_pb() for reply in self.replies]
        )
    
    def create(self):
        '''
        Create a comment if it is not created in DB.
        No-op if the comment is already exists.
        '''
        if self.comment_id:
            logger.info(f'{self} already exists')
            return

        self.create_time = get_now()
        self.update_time = self.create_time

        sql = f'INSERT INTO comments ({self._db_fields()}) '\
              f'VALUES ({self._db_fileds_value()}) RETURNING comment_id'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'parent': self.parent,
            'create_time': self.create_time,
            'update_time': self.update_time,
            'text': self.text,
            'author_id': self.author_id,
            'upvote_count': self.upvote_count
        })
        self.comment_id = resp[0]
    
    def delete(self) -> None:
        for reply in self.replies:
            try:
                reply.delete()
            except Exception as err:
                logger.error(f'Failed to delete reply={reply} under comment={self}: {err}')
        
        try:
            Activity.delete_resource(f'comment_id:{self.comment_id}')
        except Exception as err:
            logger.error(f'Failed to delete related activities for {self}: {err}')

        sql = 'DELETE FROM comments WHERE comment_id=%(comment_id)s'
        run_sql_with_param(sql, {
            'comment_id': self.comment_id
        })
        logger.info(f'{self} is deleted')
    
    def update(self, update_stamp: bool = False) -> None:
        if update_stamp:
            sql = 'UPDATE comments SET text=%(text)s, upvote_count=%(upvote_count)s, update_time=%(update_time)s WHERE comment_id=%(comment_id)s'
        else:
            sql = 'UPDATE comments SET text=%(text)s, upvote_count=%(upvote_count)s WHERE comment_id=%(comment_id)s'
        run_sql_with_param(sql, {
            'text': self.text,
            'upvote_count': self.upvote_count,
            'update_time': get_now(),
            'comment_id': self.comment_id
        })
    
    @staticmethod
    def _db_fields() -> str:
        '''
        This list match parameter list of constructor
        '''
        return 'parent, comment_id, create_time, update_time, text, author_id, upvote_count'
    
    @staticmethod
    def _db_fileds_value() -> str:
        return '%(parent)s, COALESCE((SELECT MAX(comment_id) FROM comments)+1, 1) '\
            ', %(create_time)s, %(update_time)s, %(text)s, %(author_id)s '\
            ', %(upvote_count)s'

    