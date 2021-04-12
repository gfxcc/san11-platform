from typing import Iterable
from datetime import datetime
from typing import Iterable

from ..db_util import run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all
from ..protos import san11_platform_pb2


class Reply:
    def __init__(self, comment_id: int, reply_id: int, create_time: datetime,
                 update_time: datetime, text: str, author_id: int, 
                 upvote_count: int) -> None:
        self.comment_id = comment_id
        self.reply_id = reply_id
        self.create_time = create_time.replace(microsecond=0)
        self.update_time = update_time.replace(microsecond=0)
        self.text = text
        self.author_id = author_id
        self.upvote_count = upvote_count
    
    def __str__(self) -> str:
        return f'{{reply_id: {self.reply_id}, text: {self.text}}}'
    
    @classmethod
    def list_replies(cls, comment_id: int) -> Iterable:
        if not comment_id:
            return []
        sql = f'SELECT {cls._db_fields()} FROM replies WHERE comment_id=%(comment_id)s ORDER BY create_time DESC'
        resp = run_sql_with_param_and_fetch_all(sql, {
            'comment_id': comment_id
        })
        return (cls(*item) for item in resp)
    
    def to_pb(self) -> san11_platform_pb2.Reply:
        return san11_platform_pb2.Reply(
            comment_id=self.comment_id,
            reply_id=self.reply_id,
            create_time=str(self.create_time),
            update_time=str(self.update_time),
            text=self.text,
            author_id=self.author_id,
            upvote_count=self.upvote_count
        )

    # internals
    @staticmethod
    def _db_fields() -> str:
        '''
        This list match parameter list of constructor
        '''
        return 'comment_id, reply_id, create_time, update_time, text, author_id, upvote_count'

    