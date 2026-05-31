from __future__ import annotations

import inspect
import copy
import json
import logging
import os
from typing import Dict, Generic, List, Optional, Tuple, Type, TypeVar, Union

from handler.model.base import ListOptions
from handler.model.base import base_storage
from handler.model.base.base import COLLECTION_TO_MODEL
from handler.util.name_util import ResourceName
from handler.common.exception import FailedPrecondition, InvalidArgument, NotFound
from handler.db.db_util import (auto_adjust_resource_id_next_val,
                                run_sql_with_param,
                                run_sql_with_param_and_fetch_all,
                                run_sql_with_param_and_fetch_one)

logger = logging.getLogger(os.path.basename(__file__))

_RESOURCE_T = TypeVar('_RESOURCE_T', bound=base_storage.StorageSerializable)


class ResourceRepository(Generic[_RESOURCE_T]):
    """Persistence boundary for a resource model.

    Resource models still define representation and conversion. Repositories
    own the handler-facing persistence API so application code does not call
    model-owned storage methods directly.
    """

    def __init__(self, model_class: Type[_RESOURCE_T]):
        self.model_class = model_class

    def get(self, name: str) -> _RESOURCE_T:
        parent, resource_id = base_storage.parse_name(self.model_class._DB_TABLE, name)
        sql = f'SELECT data FROM {self.model_class._DB_TABLE} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'parent': parent,
            'resource_id': resource_id,
        })
        if not resp:
            raise NotFound(
                message=f'parent={parent}, resource_id={resource_id} can not be found in table={self.model_class._DB_TABLE}')
        return self.model_class.from_db(resp[0])

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

        sql = f"SELECT data FROM {self.model_class._DB_TABLE} {where_statement} {order_statement} {limit_statement}"
        logger.debug(sql)
        resp = run_sql_with_param_and_fetch_all(sql, params)

        next_page_options = copy.copy(list_options)
        next_page_options.watermark = list_options.watermark + len(resp)

        return [self.model_class.from_db(data[0]) for data in resp], next_page_options.to_token()

    def find(self, parent: Optional[str], filter: str) -> _RESOURCE_T:
        items, _ = self.list(ListOptions(parent=parent, filter=filter))
        if not items:
            raise NotFound()
        if len(items) > 1:
            raise FailedPrecondition()
        return items[0]

    def exists(self, name: str) -> bool:
        parent, resource_id = base_storage.parse_name(self.model_class._DB_TABLE, name)
        sql = f'SELECT count(*) FROM {self.model_class._DB_TABLE} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'parent': parent,
            'resource_id': resource_id,
        })
        return resp[0] == 1

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
        if resource_id is None:
            sql = f"INSERT INTO {self.model_class._DB_TABLE} (parent, data) VALUES (%(parent)s, %(data)s) RETURNING resource_id"
            resp = run_sql_with_param_and_fetch_one(sql, {
                'parent': parent,
                'data': json.dumps(data, default=str),
            })
            resource_id = resp[0]
        else:
            sql = f"INSERT INTO {self.model_class._DB_TABLE} (parent, resource_id, data) VALUES (%(parent)s, %(resource_id)s, %(data)s)"
            run_sql_with_param(sql, {
                'parent': parent,
                'resource_id': resource_id,
                'data': json.dumps(data, default=str),
            })
            auto_adjust_resource_id_next_val(self.model_class._DB_TABLE)

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
        sql = f"UPDATE {self.model_class._DB_TABLE} SET data=%(data)s WHERE parent=%(parent)s AND resource_id=%(resource_id)s"
        run_sql_with_param(sql, {
            'parent': parent,
            'resource_id': resource_id,
            'data': json.dumps(resource.to_db(), default=str),
        })
        logger.debug(f'UPDATED {resource}')

    def delete(self,
               resource: _RESOURCE_T,
               actor_info: Optional[Union[int, str]] = None) -> _RESOURCE_T:
        _invoke_delete_hook(resource, actor_info)
        parent, resource_id = base_storage.parse_name(
            self.model_class._DB_TABLE, resource.name)
        sql = f'DELETE FROM {self.model_class._DB_TABLE} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        run_sql_with_param(sql, {
            'parent': parent,
            'resource_id': resource_id,
        })
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
