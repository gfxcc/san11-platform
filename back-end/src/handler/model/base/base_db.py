from __future__ import annotations

import copy
import datetime
import json
import logging
import os
import re
from abc import ABC
from dataclasses import dataclass
from typing import (Any, Callable, Dict, Generic, Iterable, List, Optional,
                    Tuple, Type, TypeVar, Union)

import attrs

from handler.model.base import base_proto
from handler.util.name_util import ResourceName

from ...common.exception import FailedPrecondition, InvalidArgument, NotFound
from ...db.db_util import (auto_adjust_resource_id_next_val,
                           run_sql_with_param,
                           run_sql_with_param_and_fetch_all,
                           run_sql_with_param_and_fetch_one)
from ...protos import san11_platform_pb2 as pb
from ...util.time_util import get_now
from . import base_core
from .common.list_options import FieldTrait, ListOptions, PostgresAdaptor

logger = logging.getLogger(os.path.basename(__file__))

_MODEL_T = TypeVar('_MODEL_T')
_DB_MODEL_T = TypeVar('_DB_MODEL_T')
_SUB_DB_MODEL_T = TypeVar('_SUB_DB_MODEL_T', bound='DbModel')


class DbConverter(Generic[_MODEL_T, _DB_MODEL_T]):
    '''Convert attribute between value and proto_value'''

    def to_model(self, db_value: _DB_MODEL_T) -> _MODEL_T:
        raise NotImplementedError()

    def from_model(self, value: _MODEL_T) -> _DB_MODEL_T:
        raise NotImplementedError()


class PassThroughConverter(DbConverter[Any, Any]):
    def to_model(self, db_value: Any) -> Any:
        return db_value

    def from_model(self, value: Any) -> Any:
        return value


class DatetimeDbConverter(DbConverter[datetime.datetime, str]):
    def to_model(self, db_value: str) -> datetime.datetime:
        if db_value:
            return datetime.datetime.fromisoformat(db_value).replace(tzinfo=datetime.timezone.utc)
        else:
            logger.warn(f'Invalid datetime field is encountered.')
            return datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)

    def from_model(self, value: datetime.datetime) -> datetime.datetime:
        return value.astimezone(datetime.timezone.utc)


@attrs.define
class NestedDbConverter(DbConverter):
    from_model_exec: Callable[[Any], Any] = lambda x: x
    to_model_exec: Callable[[Any], Any] = lambda x: x

    def from_model(self, value: _MODEL_T) -> Union[_DB_MODEL_T, None]:
        if value is None:
            return None
        return self.from_model_exec(value)

    def to_model(self, db_value: _DB_MODEL_T) -> Union[_MODEL_T, None]:
        if db_value is None:
            return None
        return self.to_model_exec(db_value)


def build_nested_converter(cls: DbModelBase):
    return NestedDbConverter(from_model_exec=lambda v: v.to_db(), to_model_exec=cls.from_db)


@dataclass
class DbField:
    name: str
    converter: DbConverter
    model_path: str
    repeated: bool
    type: type


class DbModelBase(ABC):
    @classmethod
    def from_db(cls, db_value: Dict) -> _SUB_DB_MODEL_T:
        obj_args = {}
        for attribute in attrs.fields(cls):
            name = attribute.name

            if attribute.metadata.get(base_core.IS_DB_FIELD):
                db_field_path = _get_db_path(attribute)
                # Handle the case where db_value itself is None. This could happen
                # on nested message.
                field_value = db_value.get(db_field_path) if db_value else None
            else:
                field_value = None

            obj_args[name] = _attribute_from_db(attribute, field_value)
        ret = cls(**obj_args)
        # logger.debug(f'{cls.__name__}.from_db({json.dumps(db_value)}) -> {ret}')
        return ret

    def to_db(self) -> Dict:
        data = {}
        for attribute in attrs.fields(type(self)):
            if not attribute.metadata[base_core.IS_DB_FIELD]:
                continue
            name, db_field_path = attribute.name, _get_db_path(attribute)
            field_value = _attribute_to_data(
                attribute, getattr(self, name))
            if field_value is not None:
                data[db_field_path] = field_value
        # logger.debug(f'{type(self).__name__}.to_db({self}) -> {data}')
        return data


class DbModel(DbModelBase):
    _DB_TABLE: str = ''
    _DB_FIELDS_DICT: Dict[str, DbField]
    _SERIAL_ID: DbField
    _LIST_OPTIONS_ADAPTOR: PostgresAdaptor

    def is_exist(self):
        '''
        Returns:
            True: if a DB resource with self.name exists.
        '''
        parent, resource_id = self._parse_name(self.name)
        sql = f'SELECT count(*) FROM {self._DB_TABLE} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'parent': parent,
            'resource_id': resource_id,
        })
        return resp[0] == 1

    def create(self, parent: str) -> None:
        '''
        Persist the resource to DB.
        Raise:
            AlreadyExists: if the resource is already exists in DB.
        '''
        return self._create(parent, None)

    def _create(self, parent: str, resource_id: Optional[int]) -> None:
        '''
        Persist the resource to DB.
        Args:
            parent: field `parent` in DB.
            resource_id: pass `None` to allow field `resource_id` to be auto assign, which
                is concurrent safe. Check the avaibility of resource_id before specifing it to certain value.
                Specifing `resource_id` to an integer value will make the method not concurrent-safe. 
                Use with caution.
        '''
        def get_name(parent: str, collection_name: str, resource_id: int) -> str:
            segments = [collection_name, resource_id]
            if parent:
                segments.insert(0, parent)
            return '/'.join(map(str, segments))

        db_table = self._DB_TABLE
        data = self.to_db()
        if resource_id is None:
            sql = f"INSERT INTO {db_table} (parent, data) VALUES (%(parent)s, %(data)s) RETURNING resource_id"
            params = {
                'parent': parent,
                'data': json.dumps(data, default=str)
            }
            resp = run_sql_with_param_and_fetch_one(sql, params)
            resource_id = resp[0]
            self.name = get_name(parent, self._DB_TABLE, resource_id)
        else:
            sql = f"INSERT INTO {db_table} (parent, resource_id, data) VALUES "\
                  f" (%(parent)s, %(resource_id)s, %(data)s)"
            params = {
                'parent': parent,
                'resource_id': resource_id,
                'data': json.dumps(data, default=str)
            }
            self.name = get_name(parent, self._DB_TABLE, resource_id)
            run_sql_with_param(sql, params)
            # Update NextVal
            auto_adjust_resource_id_next_val(db_table)
        logger.debug(f'CREATED: {self}')
        DbModel.update(self, update_update_time=False)

    @classmethod
    def from_name(cls: Type[_SUB_DB_MODEL_T], name: str) -> _SUB_DB_MODEL_T:
        db_table = cls._DB_TABLE
        parent, resource_id = cls._parse_name(name)
        predicate = ' AND '.join(
            [f'{field}=%({field})s' for field in ['parent', 'resource_id']])
        sql = f'SELECT data FROM {db_table} '\
            f"WHERE {predicate}"
        params = {'parent': parent, 'resource_id': resource_id}
        resp = run_sql_with_param_and_fetch_one(
            sql, params)
        if not resp:
            raise NotFound(
                message=f'{params} can not be found in table={db_table}')
        return cls.from_db(resp[0])

    @classmethod
    def list(cls: Type[_SUB_DB_MODEL_T], list_options: ListOptions) -> Tuple[List[_SUB_DB_MODEL_T], str]:
        db_table = cls._DB_TABLE

        try:
            order_statement = cls._LIST_OPTIONS_ADAPTOR.gen_order_by(
                list_options)
            where_statement, params = cls._LIST_OPTIONS_ADAPTOR.gen_where(
                list_options)
            limit_statement = cls._LIST_OPTIONS_ADAPTOR.gen_limit(list_options)
        except ValueError as err:
            raise InvalidArgument(
                message=f'Invalid list_options = {list_options}: {err}')

        sql = f"SELECT data FROM {db_table} {where_statement} {order_statement} {limit_statement}"
        logger.debug(sql)
        resp = run_sql_with_param_and_fetch_all(sql, params)

        next_page_options = copy.copy(list_options)
        next_page_options.watermark = list_options.watermark + len(resp)

        return [cls.from_db(data[0]) for data in resp], next_page_options.to_token()

    @classmethod
    def find(cls, parent: Optional[str], filter: str) -> _SUB_DB_MODEL_T:
        '''
        Find a specific item.
        Raise exception if none or multiple matched items are found.
        '''
        list_option = ListOptions(parent=parent, filter=filter)
        items, _ = cls.list(list_option)
        if not items:
            raise NotFound()
        elif len(items) > 1:
            raise FailedPrecondition()
        return items[0]

    def update(self, update_update_time: bool = True) -> None:
        if update_update_time:
            self.update_time = get_now()

        db_table = self._DB_TABLE
        data = self.to_db()
        db_fields_name = ['parent', 'resource_id', 'data']
        parent, resource_id = self._parse_name(self.name)
        sql = f"UPDATE {db_table} SET data=%(data)s WHERE parent=%(parent)s AND resource_id=%(resource_id)s"
        params = {
            'parent': parent,
            'resource_id': resource_id,
            'data': json.dumps(data, default=str)
        }
        run_sql_with_param(sql, params)
        logger.debug(f'UPDATED {self}')

    def delete(self) -> None:
        parent, resource_id = self._parse_name(self.name)
        sql = f'DELETE FROM {self._DB_TABLE} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        params = {
            'parent': parent,
            'resource_id': resource_id,
        }
        run_sql_with_param(sql, params)
        logger.debug(f'DELETED: {self}')

    def backfill(self) -> None:
        '''
        Backfill will try to preserve the resource name as provided. Failed to 
        do so will result as failure. E.g. resource_id collision.
        This is reserved for data model migration.
        '''
        # 1. Safe checks
        if not self.name:
            raise InvalidArgument(
                message='Field `name` is required for backfill.')
        try:
            self.from_name(self.name)
        except NotFound:
            ...
        else:
            raise InvalidArgument(
                message=f'Resource name: {self.name} is used.')
        # 2. Create resource
        name = ResourceName.from_str(self.name)
        self._create(parent=str(name.parent),
                     resource_id=name.resource_id)

    @classmethod
    def _parse_name(cls, name: str) -> Tuple[str, int]:
        NAME_PATTERN = r'((?P<parent>.+)/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
        match = re.fullmatch(NAME_PATTERN, name)
        # Table name should equal to `collection` in most case.
        # However, it is also possible that table name is suffixed with `_legacy`
        # due to data migration.
        if not match or match['collection'] not in cls._DB_TABLE:
            raise InvalidArgument(
                f'{name} is not a valid resource name in {cls._DB_TABLE}')
        return match['parent'] or '', int(match['resource_id'])


def init_db_model(cls: type, db_table: str) -> None:
    cls._DB_TABLE = db_table
    fields_trait = {}
    for attribute in attrs.fields(cls):
        if not attribute.metadata[base_core.IS_DB_FIELD]:
            continue
        name, is_repeated, type = _get_db_path(
            attribute), base_core.is_repeated(attribute), attribute.type
        fields_trait[name] = FieldTrait(name, is_repeated, type)
    cls._LIST_OPTIONS_ADAPTOR = PostgresAdaptor(fields_trait)


def _get_db_path(attribute: attrs.Attribute) -> str:
    return attribute.metadata.get(base_core.DB_PATH, attribute.name)


def _is_db_field(attribute: attrs.Attribute) -> bool:
    return attribute.metadata[base_core.IS_DB_FIELD]


def _attribute_from_db(attribute: attrs.Attribute, value: Any):
    # Newly added field may not have value in db.
    def populate_default(value, type):
        if value is None and type in [str, int, bool]:
            return type()
        return value
    converter: DbConverter = _attribute_db_converter(attribute)
    if base_core.is_repeated(attribute):
        return [populate_default(converter.to_model(item), attribute.type)
                for item in (value or [])]
    else:
        return populate_default(converter.to_model(
            value), attribute.type)


def _attribute_to_data(attribute: attrs.Attribute, value: Any):
    converter = _attribute_db_converter(attribute)
    if base_core.is_repeated(attribute):
        return [converter.from_model(item)
                for item in value]
    else:
        return converter.from_model(value)


def _attribute_db_converter(attribute: attrs.Attribute) -> DbConverter:
    converter: DbConverter = attribute.metadata.get(base_core.DB_CONVERTER)
    return converter or PassThroughConverter()
