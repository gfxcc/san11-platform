import os
import time
import logging
import uuid

from ..db_util import run_sql_with_param, run_sql_with_param_and_fetch_one
from ..user.user import User


logger = logging.getLogger(os.path.basename(__file__))


class Session:
    def __init__(self, sid: str, user_id: int, expiration: int):
        self.sid = sid
        self.expiration = expiration
        self.user = User.from_user_id(user_id)
    
    def __str__(self):
        return f'{{sid: {self.sid}, user_id: {self.user.user_id}, expiration: {self.expiration}}}'

    def is_valid(self):
        '''
        Return:
            True: ...
            False: if this session is expired
        '''
        return self.expiration > int(time.time())
    
    def extend(self, validity_day: int = 7):
        expiration = int(time.time()) + validity_day * 24 * 60 * 60
        
        sql = 'UPDATE sessions SET expiration=%(expiration)s WHERE sid=%(sid)s'
        run_sql_with_param(sql, {'sid': self.sid, 'expiration': expiration})
        logger.debug(f'{self} is extended')

    def revoke(self):
        sql = "DELETE FROM sessions WHERE sid=%(sid)s"
        run_sql_with_param(sql, {'sid': self.sid})
        self.expiration = 0
        logger.info(f'session:{self} is revoked')

    @classmethod
    def from_sid(cls, sid: str):
        '''
        Raise:
            LookUpError
        '''
        sql = "SELECT user_id, expiration FROM sessions WHERE sid=%(sid)s"
        try:
            user_id, expiration = run_sql_with_param_and_fetch_one(sql, {'sid': sid})
        except Exception:
            raise LookupError(f'Failed to find session: sid={sid}')
        obj = cls(sid, user_id, expiration)
        if not obj.is_valid():
            logger.warn(f'{obj} is expired')
            raise Exception('请重新登陆')
        return obj

    @classmethod
    def from_user_id(cls, user_id: int):
        '''
        Raise:
            LookUpError
        '''
        sql = "SELECT sid, expiration FROM sessions WHERE user_id=%(user_id)s"
        try:
            sid, expiration = run_sql_with_param_and_fetch_one(sql, {'user_id': user_id})
        except Exception:
            raise LookupError(f'Failed to find session: user_id={user_id}')
        return cls(sid, user_id, expiration)

    @classmethod
    def create(cls, user_id, validity_day: int = 7):
        expiration = int(time.time()) + validity_day * 24 * 60 * 60
        sid = str(uuid.uuid1())

        sql = 'INSERT INTO sessions VALUES (%(sid)s, %(user_id)s, %(expiration)s)'
        run_sql_with_param(sql, {'sid': sid, 'user_id': user_id, 'expiration': expiration})

        obj = cls(sid, user_id, expiration)
        logger.info(f'session: {obj} is created')
        return obj
