import os, os.path
import errno
from abc import ABC, abstractclassmethod, abstractmethod, abstractproperty
from typing import List, Any, Iterable
from .exception import NotFound, AlreadyExists


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
        '''
        ...
    
    # factory classmethods 
    @abstractclassmethod
    def from_id(cls, id: int):
        '''
        Return the object by id.
        Raise:
            NotFound: if there is not a resource stored with given `id`.
        '''
        ...

    @abstractclassmethod
    def from_pb(cls, pb_obj):
        '''
        Convert the pb_obj into a `Resource` object
        '''
        ...

    @abstractclassmethod
    def list(cls, page_size: int, page_token: str, **kwargs) -> Iterable[Any]:
        '''
        List resource.
        '''
        ...
    
    # Methods
    @abstractmethod
    def create(self) -> None:
        '''
        Persist the resource to DB.
        Raise:
            AlreadyExists: if the resource is already exists in DB.
        '''
        ...
    
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
    
