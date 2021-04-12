import os
import logging

from typing import List
from enum import Enum

from ..db_util import run_sql_with_param_and_fetch_one, run_sql_with_param
from ..time_util import get_now


logger = logging.getLogger(os.path.basename(__file__))


class Action(Enum):
    UPVOTE = 1
    LIKE = 2


class Activity:
    def __init__(self, user_id: int, resource: str, action: Action):
        self.user_id = user_id
        self.resource = resource
        self.action = action
    
    def __str__(self) -> str:
        return f'{{user_id: {self.user_id}, resource: {self.resource}, action: {self.action}}}'
    
    def isExist(self) -> bool:
        sql = f'SELECT count(*) FROM activities WHERE '\
               'user_id=%(user_id)s AND resource=%(resource)s AND action=%(action)s'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'user_id': self.user_id, 
            'resource': self.resource,
            'action': self.action.name
        })
        return resp[0] == 1
    
    def create(self) -> None:
        '''
        No-op if given action already exists.
        '''
        if self.isExist():
            logger.info(f'{self} exist: no-op')
            return
        sql = f'INSERT INTO activities ({self._db_fields_str()}) '\
              f'VALUES ({self._db_fileds_value_str()})'
        run_sql_with_param(sql, {
            'user_id': self.user_id,
            'resource': self.resource,
            'action': self.action.name,
            'create_time': get_now()
        })
    
    def delete(self) -> None:
        '''
        No-of if given action does not exist.
        '''
        if not self.isExist:
            return
        sql = f'DELETE FROM activities WHERE '\
              f'user_id=%(user_id)s AND resource=%(resource)s AND action=%(action)s'
        run_sql_with_param(sql, {
            'user_id': self.user_id,
            'resource': self.resource,
            'action': self.action.name
        })
        logger.info(f'{self} is deleted.')
    
    @classmethod
    def _db_fields(cls) -> List[str]:
        return ['user_id', 'resource', 'action', 'create_time']

    @classmethod
    def _db_fields_str(cls) -> str:
        return ','.join(cls._db_fields())
    
    @classmethod
    def _db_fileds_value_str(cls) -> str:
        return ','.join(f'%({field})s' for field in cls._db_fields())
