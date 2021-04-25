from abc import ABC, abstractclassmethod, abstractmethod


class ResourceExistsError(Exception):
    ...


class ResourceMixin(ABC):
    @abstractclassmethod
    def from_id(cls, id: int):
        '''
        Return the object by id.
        Raise:
            KeyError: if there is not a resource stored with given `id`.
        '''
        ...
    
    @abstractclassmethod
    def from_pb(cls, pb_obj):
        '''
        Convert the pb_obj into a `Resource` object
        '''
        ...
    
    @abstractmethod
    def create(self):
        '''
        Persist the resource to DB.
        Raise:
            ResourceExistsError: if given resource is already exists.
        '''
    
    @abstractmethod
    def delete(self):
        '''
        Delete the resource from DB.
        Raise:
            KeyError
        '''