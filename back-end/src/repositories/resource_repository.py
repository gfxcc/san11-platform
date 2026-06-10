from __future__ import annotations

import inspect
import copy
import logging
import os
from typing import Dict, Generic, List, Optional, Tuple, Type, TypeVar, Union

from core.models.base import ListOptions
from core.models.base import base_storage
from core.models.base.base import COLLECTION_TO_MODEL
from core.resources.name_util import ResourceName
from core.errors.exceptions import FailedPrecondition, InvalidArgument, NotFound
from repositories.postgres_resource_storage import PostgresResourceStorage

logger = logging.getLogger(os.path.basename(__file__))

_RESOURCE_T = TypeVar('_RESOURCE_T', bound=base_storage.StorageSerializable)


class ResourceRepository(Generic[_RESOURCE_T]):
    """Persistence boundary for a resource model.

    Resource models still define representation and conversion. Repositories
    own the handler-facing persistence API so application code does not call
    model-owned storage methods directly.
    """

    def __init__(self, model_class: Type[_RESOURCE_T],
                 storage=None):
        self.model_class = model_class
        self.storage = storage or PostgresResourceStorage()

    def get(self, name: str) -> _RESOURCE_T:
        parent, resource_id = base_storage.parse_name(self.model_class._DB_TABLE, name)
        data = self.storage.get(self.model_class._DB_TABLE, parent, resource_id)
        if not data:
            raise NotFound(
                message=f'parent={parent}, resource_id={resource_id} can not be found in table={self.model_class._DB_TABLE}')
        return self.model_class.from_db(data)

    def list(self, list_options: ListOptions) -> Tuple[List[_RESOURCE_T], str]:
        try:
            order_statement = self.model_class._LIST_OPTIONS_ADAPTOR.gen_order_by(
                list_options)
            where_statement, params = self.model_class._LIST_OPTIONS_ADAPTOR.gen_where(
                list_options)
            limit_statement = self.model_class._LIST_OPTIONS_ADAPTOR.gen_limit(list_options)
        except ValueError as err:
            raise InvalidArgument(
                message=f'Invalid list_options = {list_options}: {err}')

        resp = self.storage.list(
            self.model_class._DB_TABLE,
            where_statement,
            order_statement,
            limit_statement,
            params,
        )

        next_page_options = copy.copy(list_options)
        next_page_options.watermark = list_options.watermark + len(resp)

        return [self.model_class.from_db(data[0]) for data in resp], next_page_options.to_token()

    def count(self, list_options: ListOptions) -> int:
        try:
            where_statement, params = self.model_class._LIST_OPTIONS_ADAPTOR.gen_where(
                list_options)
        except ValueError as err:
            raise InvalidArgument(
                message=f'Invalid list_options = {list_options}: {err}')

        return self.storage.count(
            self.model_class._DB_TABLE,
            where_statement,
            params,
        )

    def find(self, parent: Optional[str], filter: str) -> _RESOURCE_T:
        items, _ = self.list(ListOptions(parent=parent, filter=filter))
        if not items:
            raise NotFound()
        if len(items) > 1:
            raise FailedPrecondition()
        return items[0]

    def exists(self, name: str) -> bool:
        parent, resource_id = base_storage.parse_name(self.model_class._DB_TABLE, name)
        return self.storage.exists(self.model_class._DB_TABLE, parent, resource_id)

    def create(self,
               parent: str,
               resource: _RESOURCE_T,
               actor_info: Optional[Union[int, str]] = None) -> _RESOURCE_T:
        self._create(parent, resource, resource_id=None)
        _invoke_create_hook(resource, parent, actor_info)
        return resource

    def _create(self, parent: str, resource: _RESOURCE_T,
                resource_id: Optional[int]) -> None:
        data = resource.to_db()
        resource_id = self.storage.insert(
            self.model_class._DB_TABLE,
            parent,
            data,
            resource_id,
        )
        resource.name = base_storage.build_resource_name(
            parent, self.model_class._DB_TABLE, resource_id)
        self._update(resource)
        logger.debug(f'CREATED: {resource}')

    def update(self,
               resource: _RESOURCE_T,
               update_update_time: bool = True,
               actor_info: Optional[Union[int, str]] = None) -> _RESOURCE_T:
        _invoke_update_hook(resource, update_update_time, actor_info)
        self._update(resource)
        return resource

    def _update(self, resource: _RESOURCE_T) -> None:
        parent, resource_id = base_storage.parse_name(
            self.model_class._DB_TABLE, resource.name)
        self.storage.update(
            self.model_class._DB_TABLE,
            parent,
            resource_id,
            resource.to_db(),
        )
        logger.debug(f'UPDATED {resource}')

    def delete(self,
               resource: _RESOURCE_T,
               actor_info: Optional[Union[int, str]] = None) -> _RESOURCE_T:
        _invoke_delete_hook(resource, actor_info)
        parent, resource_id = base_storage.parse_name(
            self.model_class._DB_TABLE, resource.name)
        self.storage.delete(self.model_class._DB_TABLE, parent, resource_id)
        logger.debug(f'DELETED: {resource}')
        return resource


_REPOSITORIES: Dict[Type[base_storage.StorageSerializable], ResourceRepository] = {}


def repository_for(model_class: Type[_RESOURCE_T]) -> ResourceRepository[_RESOURCE_T]:
    if model_class not in _REPOSITORIES:
        _REPOSITORIES[model_class] = ResourceRepository(model_class)
    return _REPOSITORIES[model_class]


def repository_for_name(name: Union[str, ResourceName]) -> ResourceRepository:
    resource_name = ResourceName.from_str(name) if isinstance(name, str) else name
    return repository_for(COLLECTION_TO_MODEL[resource_name.collection])


def _accepts_kwarg(func, kwarg: str) -> bool:
    return kwarg in inspect.signature(func).parameters


def _invoke_create_hook(resource, parent: str,
                        actor_info: Optional[Union[int, str]]) -> None:
    if _accepts_kwarg(resource.create, 'actor_info'):
        resource.create(parent=parent, actor_info=actor_info)
        return
    params = inspect.signature(resource.create).parameters
    if actor_info is not None and len(params) > 1:
        resource.create(parent, actor_info)
    else:
        resource.create(parent=parent)


def _invoke_update_hook(resource, update_update_time: bool,
                        actor_info: Optional[Union[int, str]]) -> None:
    if _accepts_kwarg(resource.update, 'actor_info'):
        resource.update(update_update_time=update_update_time,
                        actor_info=actor_info)
    else:
        resource.update(update_update_time=update_update_time)


def _invoke_delete_hook(resource,
                        actor_info: Optional[Union[int, str]]) -> None:
    if _accepts_kwarg(resource.delete, 'actor_info'):
        resource.delete(actor_info=actor_info)
    else:
        resource.delete()
