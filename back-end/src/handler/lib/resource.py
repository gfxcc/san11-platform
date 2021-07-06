from logging import Logger
import logging
import re
import os
import os.path
import errno
from abc import ABC, abstractclassmethod, abstractmethod, abstractproperty
from typing import List, Any, Iterable, Dict
from .exception import NotFound, AlreadyExists

from .time_util import get_now
from .protos import san11_platform_pb2
from .db import get_db_fields_placeholder_str, get_db_fields_str, get_db_fields_assignment_str, \
    run_sql_with_param_and_fetch_one, run_sql_with_param, run_sql_with_param_and_fetch_all
from .activity import Action, Activity, TrackLifecycle


RESOURCE_PATH = '/data'
logger = logging.getLogger(os.path.basename(__file__))


def get_image_url(parent: str, filename: str, in_description: bool) -> str:
    sub_path = 'images' if not in_description else 'images/desc'
    return f'{parent}/{sub_path}/{filename}'


def get_binary_url(parent: str, filename: str) -> str:
    return f'{parent}/binaries/{filename}'


class ResourceView:
    def __init__(self, name: str, display_name: str, description: str, image_url: str) -> None:
        self.name = name
        self.display_name = display_name
        self.description = description
        self.image_url = image_url

    def to_pb(self) -> san11_platform_pb2.ResourceView:
        return san11_platform_pb2.ResourceView(
            name=self.name,
            display_name=self.display_name,
            description=self.description,
            image_url=self.image_url
        )


class ResourceMixin(ABC):
    '''
    Adopted classes:
        - Packages
        - Binary
        - Tag
        - User
        - Comment
        - Reply
    '''

    def __str__(self) -> str:
        return f'{self.name}'

    @abstractproperty
    def name(self) -> str:
        '''
        A website wide identical name.
        E.g. 
            - categories/12
            - categories/12/packages/34
            - users/12
        '''
        ...

    @abstractproperty
    def id(self) -> int:
        '''
        A identifier within its collection.
        E.g. 
            A category: name=categories/123 => id=123
            A package: name=categories/123/packages/456 => id=456
        '''
        ...

    @abstractproperty
    def view(self) -> ResourceView:
        ...

    # classmethods
    @abstractclassmethod
    def db_table(cls) -> str:
        '''
        Table name
        '''
        ...

    @abstractclassmethod
    def db_fields(cls) -> List[str]:
        '''
        Return a list for DB fields.
        The order of those fields should match its order in the constructor.
        First field MUST BE the resource_id field. E.g. package_id, image_id, user_id
        '''
        ...

    @abstractclassmethod
    def name_pattern() -> str:
        '''
        Regex pattern for resource name:
        E.g.
            - Package -> `categories/[0-9]+/packages/[0-9]+`
        '''
        ...

    # factory classmethods
    @classmethod
    def from_id(cls, resource_id: int):
        '''
        Construct the resource based on `resource_id`
        This rely on the first field of `cls.db_fields()` is the resource_id field.

        Raise:
            - NotFound
        '''
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()} '\
            f'WHERE {cls.db_fields()[0]}=%(resource_id)s'
        resp = run_sql_with_param_and_fetch_one(
            sql, {'resource_id': resource_id})
        if not resp:
            raise NotFound(f'resource_id={resource_id} can not be found in table={cls.db_table()}')
        return cls(*resp)

    @classmethod
    def from_name(cls, name: str):
        '''
        name: full resource name like `categories/123/packages/456/comments/789`
        '''
        assert re.fullmatch(cls.name_pattern(
        ), name), f'Invalid resource name: {name}. Expected pattern: {cls.name_pattern()}'
        resource_id = int(name.split('/')[-1])
        return cls.from_id(resource_id=resource_id)

    @abstractclassmethod
    def from_pb(cls, pb_obj):
        '''
        Convert the pb_obj into a `Resource` object
        '''
        ...

    @classmethod
    def list(cls, page_size: int, page_token: str, **kwargs) -> List[Any]:
        SUPPORTED_KEY = ['category_id', 'author_id',
                         'tag_id', 'package_id', 'comment_id', 'parent']
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

    # Methods
    def create(self, user_id: int, track: bool=True) -> None:
        '''
        Persist the resource to DB.
        Raise:
            AlreadyExists: if the resource is already exists in DB.
        '''
        sql = f'INSERT INTO {self.db_table()} ({get_db_fields_str(self.db_fields())}) VALUES '\
            f'( COALESCE((SELECT MAX({self.db_fields()[0]}) FROM {self.db_table()})+1, 1), '\
            f'{get_db_fields_placeholder_str(self.db_fields()[1:])}) RETURNING {self.db_fields()[0]}'
        params_raw = ','.join(
            f"'{field}': self.{field}" for field in self.db_fields())
        params = self._update_db_params(eval(f'{{ {params_raw} }}'))
        resource_id = run_sql_with_param_and_fetch_one(
            sql, params, transaction=True)[0]
        exec(f"self.{self.db_fields()[0]} = resource_id")

        if isinstance(self, TrackLifecycle) and track:
            Activity(activity_id=None, user_id=user_id, create_time=get_now(),
                     action=Action.CREATE, resource_name=self.name).create()

    def _update_db_params(self, params: Dict) -> Dict:
        '''
        Child class can override this function to patch value into `params` be 
        used for DB operations.
        '''
        return params

    def delete(self, user_id: int, track: bool=True)-> None:
        '''
        Delete the resource from DB.
        '''
        sql = f'DELETE FROM {self.db_table()} WHERE {self.db_fields()[0]}=%(resource_id)s'
        run_sql_with_param(sql, {'resource_id': self.id})
        logger.info(f'DELETED: {self.name}')
        if isinstance(self, TrackLifecycle) and track:
            Activity(activity_id=None, user_id=user_id, create_time=get_now(),
                     action=Action.DELETE, resource_name=self.name).create()

    def update(self, user_id: int, track: bool=True) -> None:
        sql = f'UPDATE {self.db_table()} SET {get_db_fields_assignment_str(self.db_fields()[1:])} '\
            f'WHERE {self.db_fields()[0]}=%({self.db_fields()[0]})s'
        params_raw = ','.join(
            f"'{field}': self.{field}" for field in self.db_fields())
        params = eval(f'{{ {params_raw} }}')
        if 'update_time' in params:
            params['update_time'] = get_now()
        params = self._update_db_params(params)
        run_sql_with_param(sql, params)
        if isinstance(self, TrackLifecycle) and track:
            Activity(activity_id=None, user_id=user_id, create_time=get_now(),
                     action=Action.UPDATE, resource_name=self.name).create()

    @abstractmethod
    def to_pb(self) -> Any:
        '''
        Convert the resource to its correspond proto object
        '''
        ...
