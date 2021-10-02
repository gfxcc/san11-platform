from __future__ import annotations

import copy
import datetime
import json
import logging
import os
import re
from abc import ABC
from typing import Any, Dict, Generic, Iterable, Optional, Tuple, TypeVar

import attr
from handler.model.base import base_proto

from ...common.exception import InvalidArgument, NotFound
from ...db.db_util import (run_sql_with_param,
                           run_sql_with_param_and_fetch_all,
                           run_sql_with_param_and_fetch_one)
from ...protos import san11_platform_pb2 as pb
from ...util.time_util import get_now
from . import base_core

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
        if db_value:
            return datetime.datetime.fromisoformat(db_value).replace(tzinfo=datetime.timezone.utc)
        else:
            logger.warn(f'Invalid datetime field is encountered.')
            return datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)

    def from_model(self, value: datetime.datetime) -> datetime.datetime:
        return value.astimezone(datetime.timezone.utc)


def parse_filter(cls: type, filter: str) -> Dict:
    '''
    Input:
        cls: class of resource class.
        filter: E.g. "create_time > '2021-07-20 10:43:28.313033+08:00'"
            "author_id = 123 AND state = 1"
            ONLY SUPPORT AND OPERATION
    Returns parsed key, value parse as a dictionary.
    '''
    proto2db = {}
    for attribute in attr.fields(cls):
        proto2db[base_proto._get_proto_path(
            attribute)] = _get_db_path(attribute)

    kwargs = {}
    segments = map(str.strip, re.split('AND | OR', filter))
    for segment in segments:
        if not segment:
            continue
        k, v = map(str.strip, segment.split('='))
        kwargs[proto2db[k]] = v
    return kwargs


def parse_order_by(cls: type, order_by: str) -> Iterable[Tuple[str, str]]:
    '''
    Input:
        cls: class of resource class.
        order_by: E.g. "create_time", "create_time desc, download_count"
    Returns:
        parsed_order_by: [[field_name, order], [field_name, order]].
            E.g. [('create_time', 'desc'), ('download_count', '')]
    '''
    proto2db = {}
    for attribute in attr.fields(cls):
        proto2db[base_proto._get_proto_path(
            attribute)] = _get_db_path(attribute)

    ret = []
    for segment in order_by.split(','):
        if not segment:
            continue
        segment = segment.strip().lower()
        field_name = segment.split()[0]
        order = 'DESC' if segment.endswith(' desc') else ''
        ret.append((field_name, order))

    return ret


@attr.s(auto_attribs=True)
class ListOptions:
    '''
    Field name in `order_by`, `filter` is proto_name.
    '''
    DEFAULT_PAGE_SIZE = 10000

    parent: str
    page_size: int = 10000
    watermark: str = attr.Factory(str)
    order_by: str = attr.Factory(str)
    filter: str = attr.Factory(str)

    @classmethod
    def from_request(cls, request):
        def get_watermark(page_token: str) -> str:
            if not page_token:
                return ''
            try:
                prev_option: pb.PaginationOption = pb.PaginationOption.ParseFromString(
                    page_token)
                if prev_option.parent != parent or prev_option.filter != filter or prev_option.order_by != order_by:
                    raise InvalidArgument(f'Invalid page_token')
                return prev_option.watermark
            except Exception:
                j = json.loads(page_token)
                return j['watermark']

        watermark = get_watermark(request.page_token)
        return cls(parent=request.parent,
                   page_size=request.page_size or cls.DEFAULT_PAGE_SIZE,
                   watermark=watermark,
                   order_by=request.order_by,
                   filter=request.filter)

    def to_token(self) -> str:
        return str(pb.PaginationOption(
            parent=self.parent,
            page_size=self.page_size,
            watermark=self.watermark,
            order_by=self.order_by,
            filter=self.filter,
        ).SerializeToString())


@attr.s(auto_attribs=True)
class DbField:
    name: str
    converter: DbConverter
    model_path: str
    repeated: bool


class DbModelBase(ABC):
    _DB_TABLE: str = ''
    _DB_FIELDS_DICT: Dict[str, DbField]
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

    def create(self, parent: str) -> None:
        '''
        Persist the resource to DB.
        Raise:
            AlreadyExists: if the resource is already exists in DB.
        '''
        # def get_next_resource_id(parent: str) -> int:
        #     sql = f'SELECT COALESCE(MAX(resource_id)+1, 1) FROM {self._DB_TABLE} WHERE parent=%(parent)s'
        #     return run_sql_with_param_and_fetch_one(sql, {'parent': parent})[0]

        def get_name(parent: str, collection_name: str, resource_id: int) -> str:
            segments = [collection_name, resource_id]
            if parent:
                segments.insert(0, parent)
            return '/'.join(map(str, segments))

        db_table = self._DB_TABLE
        data = self._prepare_data()
        db_fields_name = ['parent', 'resource_id', 'data']
        sql = f"INSERT INTO {db_table} (parent, data) VALUES (%(parent)s, %(data)s) RETURNING resource_id"
        params = {
            'parent': parent,
            'data': json.dumps(data, default=str)
        }
        resp = run_sql_with_param_and_fetch_one(sql, params)
        self.resource_id = resp[0]
        self.name = get_name(parent, self._DB_TABLE, self.resource_id)
        self.update(update_update_time=False)
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
    def list(cls, list_options: ListOptions) -> Tuple[Iterable[_SUB_DB_MODEL_T], str]:
        # prepare default value for mutable fields.
        if not list_options.order_by:
            order_by_fields = [('create_time', 'DESC')]
        else:
            order_by_fields = parse_order_by(cls, list_options.order_by)

        kwargs = parse_filter(cls, list_options.filter)

        db_table = cls._DB_TABLE
        # TODO: Remove special logic for data migration.
        if list_options.parent is None:
            predicate_statement = ' '
        else:
            predicate_statement = 'WHERE parent=%(parent)s'
            if kwargs:
                wheres = []
                for key in kwargs:
                    db_field = cls._DB_FIELDS_DICT[key]
                    db_path = db_field.name
                    if db_field.repeated:
                        # https://www.postgresql.org/docs/9.5/functions-json.html
                        wheres.append(
                            f"(data->'{db_path}')::jsonb ? %(db_path)s")
                    else:
                        wheres.append(f"data->>'{db_path}'=%({db_path})s")
                predicate_statement += ' AND ' + 'AND'.join(wheres)

        if order_by_fields:
            order_statement = f'ORDER BY ' + \
                ','.join(
                    f"data->>'{field_name}' {order}" for field_name, order in order_by_fields)
        else:
            order_statement = ''

        limit, offset = list_options.page_size, int(
            list_options.watermark) if list_options.watermark else 0
        size_statement = f'LIMIT {limit} OFFSET {offset}'
        sql = f"SELECT data FROM {db_table} {predicate_statement} {order_statement} {size_statement}"
        params = kwargs.copy()
        params['parent'] = list_options.parent
        resp = run_sql_with_param_and_fetch_all(sql, params)

        next_page_options = copy.copy(list_options)
        next_page_options.watermark = offset + len(resp)

        return [cls.from_data(data[0]) for data in resp], next_page_options.to_token()

    @classmethod
    def from_data(cls, data: Dict):
        obj_args = {}
        for field in cls._DB_FIELDS_DICT.values():
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
        for field in self._DB_FIELDS_DICT.values():
            data[field.name] = field.converter.from_model(
                getattr(self, field.model_path))
            # frm, to = getattr(self, field.model_path), data[field.name]
            # logger.debug(f'In _prepare_data: {type(frm)}({frm}) -> {type(to)}({to})')
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
    db_fields = {}
    for attribute in attr.fields(cls):
        if not attribute.metadata[base_core.IS_DB_FIELD]:
            continue
        converter: DbConverter = attribute.metadata[base_core.DB_CONVERTER]
        db_path = _get_db_path(attribute)
        field = DbField(
            name=db_path,
            converter=converter,
            model_path=attribute.name,
            repeated=base_core.is_repeated(attribute),
        )
        db_fields[db_path] = field
    cls._DB_FIELDS_DICT = db_fields


def _get_db_path(attribute: attr.Attribute) -> str:
    return attribute.metadata[base_core.DB_PATH] or attribute.name
