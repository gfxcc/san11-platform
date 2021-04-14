import os
import logging
from typing import Iterable, List
from datetime import datetime, timezone
from typing import Iterable

from ..db_util import run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all, \
    get_db_fields_placeholder_str, get_db_fields_str, run_sql_with_param
from ..protos import san11_platform_pb2
from ..time_util import get_now, datetime_to_str
from ..user.activity import Activity


logger = logging.getLogger(os.path.basename(__file__))


class Reply:
    def __init__(self, comment_id: int, reply_id: int, create_time: datetime,
                 update_time: datetime, text: str, author_id: int,
                 upvote_count: int) -> None:
        self.comment_id = comment_id
        self.reply_id = reply_id
        self.create_time = create_time.replace(tzinfo=timezone.utc)
        self.update_time = update_time.replace(tzinfo=timezone.utc)
        self.text = text
        self.author_id = author_id
        self.upvote_count = upvote_count

    def __str__(self) -> str:
        return f'{{reply_id: {self.reply_id}, text: {self.text}}}'

    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.Reply):
        return cls(
            comment_id=pb_obj.comment_id,
            reply_id=pb_obj.reply_id,
            create_time=pb_obj.create_time or get_now(),
            update_time=pb_obj.update_time or get_now(),
            text=pb_obj.text,
            author_id=pb_obj.author_id,
            upvote_count=pb_obj.upvote_count
        )

    @classmethod
    def from_id(cls, reply_id: int):
        sql = f'SELECT {get_db_fields_str(cls._db_fields())} FROM replies '\
            'WHERE reply_id=%(reply_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'reply_id': reply_id
        })
        return cls(*resp)

    @classmethod
    def list_replies(cls, comment_id: int) -> Iterable:
        if not comment_id:
            return []
        sql = f'SELECT {get_db_fields_str(cls._db_fields())} FROM replies '\
            ' WHERE comment_id=%(comment_id)s ORDER BY create_time'
        resp = run_sql_with_param_and_fetch_all(sql, {
            'comment_id': comment_id
        })
        return (cls(*item) for item in resp)

    def to_pb(self) -> san11_platform_pb2.Reply:
        return san11_platform_pb2.Reply(
            comment_id=self.comment_id,
            reply_id=self.reply_id,
            create_time=datetime_to_str(self.create_time),
            update_time=datetime_to_str(self.update_time),
            text=self.text,
            author_id=self.author_id,
            upvote_count=self.upvote_count
        )

    def create(self) -> None:
        '''
        Create a reply if it is not created in DB.
        No-op if the reply is already exists.
        '''
        if self.reply_id:
            logger.info(f'{self} already exists')
            return

        self.create_time = get_now()
        self.update_time = self.create_time

        sql = f'INSERT INTO replies ({get_db_fields_str(self._db_fields())}) '\
            'VALUES ('\
            '%(comment_id)s, COALESCE((SELECT MAX(reply_id) FROM replies)+1, 1) '\
            ', %(create_time)s, %(update_time)s, %(text)s, %(author_id)s '\
            ', %(upvote_count)s'\
            ') RETURNING reply_id'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'comment_id': self.comment_id,
            'create_time': self.create_time,
            'update_time': self.update_time,
            'text': self.text,
            'author_id': self.author_id,
            'upvote_count': self.upvote_count
        })
        self.reply_id = resp[0]

    def delete(self) -> None:
        sql = 'DELETE FROM replies WHERE reply_id=%(reply_id)s'
        run_sql_with_param(sql, {
            'reply_id': self.reply_id
        })
        try:
            Activity.delete_resource(f'comment_id:{self.comment_id}')
        except Exception as err:
            logger.error(f'Failed to delete related activities for {self}: {err}')

        logger.info(f'{self} is deleted')

    def update(self, update_stamp: bool=False) -> None:
        if update_stamp:
            sql = 'UPDATE replies SET text=%(text)s, upvote_count=%(upvote_count)s, update_time=%(update_time)s WHERE reply_id=%(reply_id)s'
        else:
            sql = 'UPDATE replies SET text=%(text)s, upvote_count=%(upvote_count)s WHERE reply_id=%(reply_id)s'
        run_sql_with_param(sql, {
            'text': self.text,
            'upvote_count': self.upvote_count,
            'update_time': get_now(),
            'reply_id': self.reply_id
        })

    @classmethod
    def _db_fields(cls) -> List[str]:
        return ['comment_id', 'reply_id', 'create_time', 'update_time', 'text',
                'author_id', 'upvote_count']
