import os
import logging

from typing import List, Dict, Any, Union
from datetime import datetime, timezone
from enum import Enum

from ..protos import san11_platform_pb2
from ..db import run_sql_with_param_and_fetch_one, run_sql_with_param,\
    get_db_fields_placeholder_str, get_db_fields_str, run_sql_with_param_and_fetch_all
from ..common.exception import NotFound


logger = logging.getLogger(os.path.basename(__file__))


class Action(Enum):
    UNDEFINED_ACTION = 0
    # resource
    CREATE = 1
    DELETE = 2
    UPDATE = 3
    SELECT = 4
    # social
    LIKE = 11
    UPVOTE = 12
    SUBSCRIBE = 13
    # misc
    DOWNLOAD = 21

    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.Action):
        return cls(pb_obj)

    def to_pb(self) -> san11_platform_pb2.Action:
        return self.value


class TrackLifecycle:
    '''
    Lifecyle activities on sub-class will tracked (persisted in DB).
    '''
    ...

class Activity:
    def __init__(self, activity_id: int, user_id: int, create_time: datetime, action: Union[int, Action], resource_name: str):
        '''
        Args:
            resource_name: E.g. `categories/1/packages/23`, `users/45`, `categories/1/packages/23/comments/45`
        '''
        self.activity_id = activity_id
        self.user_id = user_id
        self.create_time = create_time.replace(tzinfo=timezone.utc) if create_time.tzinfo is None else create_time
        self.action = Action(action) if isinstance(action, int) else action
        self.resource_name = resource_name

    @classmethod
    def db_table(cls) -> str:
        return 'activities'

    @classmethod
    def db_fields(cls) -> List[str]:
        return ['activity_id', 'user_id', 'create_time', 'action', 'resource_name']

    @classmethod
    def from_detail(cls, user_id: int, action: Action, resource_name: str):
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()} '\
            f'WHERE user_id=%(user_id)s AND action=%(action)s AND resource_name=%(resource_name)s'
        resp = run_sql_with_param_and_fetch_one(
            sql, {
                'user_id': user_id,
                'action': action.value,
                'resource_name': resource_name
            })
        if not resp:
            raise NotFound()
        return cls(*resp)

    @classmethod
    def list(cls, page_size: int, page_token: str, **kwargs) -> List[Any]:
        SUPPORTED_KEY = ['user_id']
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()}'
        constrains = []
        for key in SUPPORTED_KEY:
            if key in kwargs and kwargs[key]:
                if key == 'tag_id':
                    constrains.append(f"'{kwargs[key]}'=ANY(tag_ids)")
                else:
                    if isinstance(kwargs[key], str):
                        value = f'\'{kwargs[key]}\''
                    else:
                        value = str(kwargs[key])
                    constrains.append(f'{key}={value}')
        if constrains:
            sql = f"{sql} WHERE {' AND '.join(constrains)}"
        if 'create_time' in cls.db_fields():
            sql += ' ORDER BY create_time DESC'
        resp = run_sql_with_param_and_fetch_all(sql, {})
        return [cls(*item) for item in resp]

    def create(self) -> None:
        '''
        Persist the resource to DB.
        Raise:
            AlreadyExists: if the resource is already exists in DB.
        '''
        sql = f'INSERT INTO {self.db_table()} ({get_db_fields_str(self.db_fields())}) VALUES '\
            f'( COALESCE((SELECT MAX({self.db_fields()[0]}) FROM {self.db_table()})+1, 1), '\
            f'{get_db_fields_placeholder_str(self.db_fields()[1:])}) RETURNING {self.db_fields()[0]}'
        params_raw = ','.join(f"'{field}': self.{field}" for field in self.db_fields())
        params = self._update_db_params(eval(f'{{ {params_raw} }}'))
        resource_id = run_sql_with_param_and_fetch_one(sql, params, transaction=True)[0]
        exec(f"self.{self.db_fields()[0]} = resource_id")
    
    def _update_db_params(self, params_raw) -> Dict:
        params_raw['action'] = params_raw['action'].value
        return params_raw
        
    def delete(self) -> None:
        '''
        Delete the resource from DB.
        '''
        sql = f'DELETE FROM {self.db_table()} WHERE {self.db_fields()[0]}=%(resource_id)s'
        run_sql_with_param(sql, {'resource_id': self.activity_id})

    def isExist(self) -> bool:
        sql = f'SELECT count(*) FROM {self.db_table()} WHERE '\
            'user_id=%(user_id)s AND resource_name=%(resource_name)s AND action=%(action)s'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'user_id': self.user_id,
            'resource_name': self.resource_name,
            'action': self.action.value
        })
        return resp[0] == 1
