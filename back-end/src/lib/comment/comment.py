import os
import logging
from datetime import datetime
from typing import Iterable


from .reply import Reply
from ..protos import san11_platform_pb2
from ..db_util import run_sql_with_param, run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all
from ..time_util import get_now, datetime_to_str
from ..url import Url
from ..user.activity import Action, Activity


logger = logging.getLogger(os.path.basename(__file__))


class Comment:
    def __init__(self, package_id: int, comment_id: int, create_time: datetime,
                 update_time: datetime, text: str, author_id: int, 
                 upvote_count: int) -> None:
        self.package_id = package_id
        self.comment_id = comment_id
        self.create_time = create_time
        self.update_time = update_time
        self.text = text
        self.author_id = author_id
        self.upvote_count = upvote_count
        self.replies = Reply.list_replies(self.comment_id)
    
    def __str__(self) -> str:
        return f'{{comment_id: {self.comment_id}, text: {self.text}, author_id: {self.author_id} }}'

    @classmethod
    def from_pb(cls, pb_obj:san11_platform_pb2.Comment):
        return cls(
            package_id=pb_obj.package_id,
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
    def list_comment(cls, parent: Url) -> Iterable:
        if parent.type != 'packages':
            raise Exception('只有工具支持评论')
        sql = f'SELECT {cls._db_fields()} FROM comments WHERE package_id=%(package_id)s ORDER BY create_time DESC'
        resp = run_sql_with_param_and_fetch_all(sql, {
            'package_id': parent.id
        })
        comments = (cls(*item) for item in resp)
        return comments

    def to_pb(self) -> san11_platform_pb2.Comment:
        return san11_platform_pb2.Comment(
            package_id=self.package_id,
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
            'package_id': self.package_id,
            'create_time': self.create_time,
            'update_time': self.update_time,
            'text': self.text,
            'author_id': self.author_id,
            'upvote_count': self.upvote_count
        })
        self.comment_id = resp[0]
    
    def delete(self) -> None:
        sql = 'DELETE FROM comments WHERE comment_id=%(comment_id)s'
        run_sql_with_param(sql, {
            'comment_id': self.comment_id
        })
        logger.info(f'{self} is deleted')
    
    def update_to(self, requested: san11_platform_pb2.Comment) -> None:
        update_stamp = False
        if requested.text:
            self.text = requested.text
            update_stamp = True
        if requested.upvote_count:
            self.upvote_count = requested.upvote_count
        self._update(update_stamp=update_stamp)

    def _update(self, update_stamp: bool) -> None:
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
        return 'package_id, comment_id, create_time, update_time, text, author_id, upvote_count'
    
    @staticmethod
    def _db_fileds_value() -> str:
        return '%(package_id)s, COALESCE((SELECT MAX(comment_id) FROM comments)+1, 1) '\
            ', %(create_time)s, %(update_time)s, %(text)s, %(author_id)s '\
            ', %(upvote_count)s'

    