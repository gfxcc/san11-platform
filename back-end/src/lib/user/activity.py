import os
import logging

from typing import List
from enum import Enum

from ..db_util import run_sql_with_param_and_fetch_one, run_sql_with_param,\
                      get_db_fields_placeholder_str, get_db_fields_str
from ..time_util import get_now


logger = logging.getLogger(os.path.basename(__file__))


class Action(Enum):
    UPVOTE = 1
    LIKE = 2


class Activity:
    def __init__(self, user_id: int, resource: str, action: Action):
        '''
        Args:
            resource: E.g. `package_id:xxxx`, `comment_id:xxxx`
        '''
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
        sql = f'INSERT INTO activities ({get_db_fields_str(self._db_fields())}) '\
              f'VALUES ({get_db_fields_placeholder_str(self._db_fields())})'
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
    def delete_resource(cls, resource: str):
        sql = 'DELETE FROM activities WHERE resource=%(resource)s'
        run_sql_with_param(sql, {
            'resource': resource
        })
    
    @classmethod
    def _db_fields(cls) -> List[str]:
        return ['user_id', 'resource', 'action', 'create_time']
