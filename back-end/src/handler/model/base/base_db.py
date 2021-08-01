from __future__ import annotations
import os
import enum
import re
import json
import logging
import attr
import datetime
from typing import Any, Dict, Generic, Iterator, List, Optional, Tuple, TypeVar
from typing import Iterable
from abc import ABC, abstractclassmethod

from . import base_core
from ...util.time_util import get_now
from ...common.exception import NotFound
from ...db.db_util import get_db_fields_assignment_str, get_db_fields_str, get_db_fields_placeholder_str
from ...db.db_util import run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all, run_sql_with_param


logger = logging.getLogger(os.path.basename(__file__))

_MODEL_T = TypeVar('_MODEL_T')
_DB_MODEL_T = TypeVar('_DB_MODEL_T')
_SUB_DB_MODEL_T = TypeVar('_SUB_DB_MODEL_T', bound='DbModelBase')


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
        return datetime.datetime.fromisoformat(db_value).replace(tzinfo=datetime.timezone.utc)

    def from_model(self, value: datetime.datetime) -> datetime.datetime:
        return value.astimezone(datetime.timezone.utc)


@attr.s(auto_attribs=True)
class DbField:
    name: str
    converter: DbConverter
    model_path: str


class DbModelBase(ABC):
    _DB_TABLE: str = ''
    _DB_FIELDS: Iterable[DbField] = []
    _SERIAL_ID: Optional[DbField] = None

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

    def create(self, parent: str, resource_id: Optional[int] = None) -> None:
        '''
        Persist the resource to DB.
        Raise:
            AlreadyExists: if the resource is already exists in DB.
        '''
        def get_next_resource_id(parent: str) -> int:
            sql = f'SELECT COALESCE(MAX(resource_id)+1, 1) FROM {self._DB_TABLE} WHERE parent=%(parent)s'
            return run_sql_with_param_and_fetch_one(sql, {'parent': parent})[0]

        def get_name(parent: str, collection_name: str, resource_id: int) -> str:
            segments = [collection_name, resource_id]
            if parent:
                segments.insert(0, parent)
            return '/'.join(map(str, segments))

        db_table = self._DB_TABLE
        resource_id = resource_id or get_next_resource_id(parent)
        self.name = get_name(parent, self._DB_TABLE, resource_id)
        data = self._prepare_data()
        db_fields_name = ['parent', 'resource_id', 'data']
        sql = f"INSERT INTO {db_table} ({get_db_fields_str(db_fields_name)}) VALUES "\
            f"({get_db_fields_placeholder_str(db_fields_name)})"
        params = {
            'parent': parent,
            'resource_id': resource_id,
            'data': json.dumps(data, default=str)
        }
        run_sql_with_param(sql, params)
        logger.info(f'CREATED: {self}')

    @classmethod
    def from_name(cls, name: str) -> _SUB_DB_MODEL_T:
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
        return cls.from_data(resp[0])

    @classmethod
    def list(cls, parent: str, offset: int = 0, limit: int = 9999,
             order_by_fields: Optional[Iterable[Tuple[str, str]]] = None, 
             **kwargs) -> Iterable[_SUB_DB_MODEL_T]:
        # prepare default value for mutable fields.
        if order_by_fields is None:
            order_by_fields = [('create_time', 'DESC')]

        db_table = cls._DB_TABLE
        predicate_statement = 'WHERE parent=%(parent)s'
        if kwargs:
            wheres = []
            for key in kwargs:
                att = attr.fields_dict(cls)[key]
                db_path = _get_db_path(att)
                if att.metadata[base_core.REPEATED]:
                    wheres.append(f"data->>%(db_path)s=ANY({db_path})")
                else:
                    wheres.append(f"data->>'{db_path}'=%({db_path})s")
            predicate_statement += ' AND ' + 'AND'.join(wheres)

        if order_by_fields:
            order_statement = f'ORDER BY ' + ','.join(f"data->>'{field_name}' {order}" for field_name, order in order_by_fields) 
        else:
            order_statement = ''

        size_statement = f'LIMIT {limit} OFFSET {offset}'
        sql = f"SELECT data FROM {db_table} {predicate_statement} {order_statement} {size_statement}"
        params = kwargs.copy()
        params['parent'] = parent
        resp = run_sql_with_param_and_fetch_all(sql, params)
        return [cls.from_data(data[0]) for data in resp]

    @classmethod
    def from_data(cls, data: Dict):
        obj_args = {}
        for field in cls._DB_FIELDS:
            obj_args[field.model_path] = field.converter.to_model(
                data.get(field.name, None))
        return cls(**obj_args)

    def update(self, update_update_time: bool = True) -> None:
        if update_update_time:
            self.update_time = get_now()

        db_table = self._DB_TABLE
        data = self._prepare_data()
        db_fields_name = ['parent', 'resource_id', 'data']
        parent, resource_id = self._parse_name(self.name)
        sql = f"UPDATE {db_table} SET data=%(data)s WHERE parent=%(parent)s AND resource_id=%(resource_id)s"
        params = {
            'parent': parent,
            'resource_id': resource_id,
            'data': json.dumps(data, default=str)
        }
        run_sql_with_param(sql, params)

    def delete(self) -> None:
        parent, resource_id = self._parse_name(self.name)
        sql = f'DELETE FROM {self._DB_TABLE} WHERE parent=%(parent)s AND resource_id=%(resource_id)s'
        params = {
            'parent': parent,
            'resource_id': resource_id,
        }
        run_sql_with_param(sql, params)
        logger.info(f'DELETED: {self}')

    def _prepare_data(self) -> Dict:
        data = {}
        for field in self._DB_FIELDS:
            data[field.name] = field.converter.from_model(
                getattr(self, field.model_path))
        return data

    @classmethod
    def _parse_name(cls, name: str) -> Tuple[str, int]:
        NAME_PATTERN = r'((?P<parent>.+)/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
        match = re.fullmatch(NAME_PATTERN, name)
        if not match or match['collection'] != cls._DB_TABLE:
            raise ValueError(
                f'{name} is not a valid resource name in {cls._DB_TABLE}')
        return match['parent'] or '', int(match['resource_id'])


def init_db_model(cls: type, db_table: str) -> None:
    cls._DB_TABLE = db_table
    pkeys = []
    db_fields = []
    for attribute in attr.fields(cls):
        if not attribute.metadata[base_core.IS_DB_FIELD]:
            continue
        converter: DbConverter = attribute.metadata[base_core.DB_CONVERTER]
        field = DbField(
            name=_get_db_path(attribute),
            converter=converter,
            model_path=attribute.name
        )
        db_fields.append(field)
    cls._DB_FIELDS = db_fields


def _get_db_path(attribute: attr.Attribute) -> str:
    return attribute.metadata[base_core.DB_PATH] or attribute.name
