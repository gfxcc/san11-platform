from logging import Logger
import os, os.path
import errno
from abc import ABC, abstractclassmethod, abstractmethod, abstractproperty
from typing import List, Any, Iterable
from .exception import NotFound, AlreadyExists

from .db import get_db_fields_placeholder_str, get_db_fields_str, run_sql_with_param_and_fetch_one, \
    run_sql_with_param, run_sql_with_param_and_fetch_all


RESOURCE_PATH = '/data'


def get_images_path(parent: str) -> str:
    return f'{RESOURCE_PATH}/{parent}/images'


def get_binaries_path(parent: str) -> str:
    return f'{RESOURCE_PATH}/{parent}/binaries'


def get_image_url(parent: str, filename: str) -> str:
    return f'{parent}/images/{filename}'


def get_binary_url(parent: str, filename: str) -> str:
    return f'{parent}/binaries/{filename}'


def get_resource_path(url: str) -> str:
    return f'{RESOURCE_PATH}/{url}'


def get_parent_type(parent: str) -> str:
    '''
    parent:
      - categories/xxx/packages/xxx
      - users/xxx
    '''
    # TODO: add more validation
    parts = parent.split('/')
    return parts[0]

def create_resource(url: str, data: bytes) -> None:
    '''
    Create a file based on given url.
    E.g. url='categories/1/packages/4/binaries/v1.2.1.scp'
      -> file='categories/1/packages/4/binaries/v1.2.1.scp'

    '''
    path = get_resource_path(url)
    if not os.path.exists(os.path.dirname(path)):
        try:
            os.makedirs(os.path.dirname(path))
        except OSError as exc: # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise
    with open(path, 'wb') as fd:
        fd.write(data)


class ResourceMixin(ABC):
    # properties
    @abstractproperty
    def url(self) -> str:
        ...

    # classmethods
    @abstractclassmethod
    def db_table(cls) -> str:
        '''
        Table name
        '''
        ...

    @abstractclassmethod
    def db_fields(cls) -> Iterable[str]:
        '''
        Return a list for DB fields.
        The order of those fields should match its order is the constructor.
        First field MUST BE the resource_id field. E.g. package_id, image_id, user_id
        '''
        ...
    
    # factory classmethods 
    @classmethod
    def from_id(cls, resource_id: int):
        '''
        Construct the resource based on `resource_id`
        This rely on the first field of `cls.db_fields()` is the resource_id field.
        '''
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()} '\
            f'WHERE {cls.db_fields()[0]}=%(resource_id)s'
        resp = run_sql_with_param_and_fetch_one(
            sql, {'resource_id': resource_id})
        return cls(*resp)


    @abstractclassmethod
    def from_pb(cls, pb_obj):
        '''
        Convert the pb_obj into a `Resource` object
        '''
        ...

    @classmethod
    def list(cls, page_size: int, page_token: str, **kwargs) -> List[Any]:
        SUPPORTED_KEY = ['category_id', 'author_id', 'tag_id', 'package_id']
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()}'
        constrains = []
        for key in SUPPORTED_KEY:
            if key in kwargs and kwargs[key]:
                if key == 'tag_id':
                    constrains.append(f"'{kwargs[key]}'=ANY(tag_ids)")
                else:
                    constrains.append(f'{key}={kwargs[key]}')
        if constrains:
            sql = f"{sql} WHERE {' AND '.join(constrains)}"
        if 'create_time' in cls.db_fields():
            sql += ' ORDER BY create_time DESC'
        resp = run_sql_with_param_and_fetch_all(sql, {})
        return [cls(*item) for item in resp]
    
    # Methods
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
        params = eval(f'{{ {params_raw} }}')
        resource_id = run_sql_with_param_and_fetch_one(sql, params)[0]
        exec(f"self.{self.db_fields()[0]} = resource_id")
    
    @abstractmethod
    def delete(self) -> None:
        '''
        Delete the resource from DB.
        Raise:
            NotFound: if the resource is not exists in DB.
        '''
        ...

    @abstractmethod
    def to_pb(self) -> Any:
        '''
        Convert the resource to its correspond proto object
        '''
        ...
    
