from __future__ import annotations
import enum, re
from handler.model.base import base_core
import attr
from typing import Any, Dict, Generic, Iterator, Optional, Tuple, TypeVar
from typing import Iterable
from abc import ABC, abstractclassmethod

from ...common.exception import NotFound
from ...db.db_util import get_db_fields_assignment_str, get_db_fields_str, get_db_fields_placeholder_str
from ...db.db_util import run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all, run_sql_with_param

_MODEL_T = TypeVar('_MODEL_T')
_DB_MODEL_T = TypeVar('_DB_MODEL_T')


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


@attr.s(auto_attribs=True)
class DbField:
    name: str
    converter: DbConverter
    model_path: str


class DbModelBase(ABC):
    _DB_TABLE: str = ''
    _DB_FIELDS: Iterable[DbField] = []
    _SERIAL_ID: Optional[DbField] = None

    def create(self, parent: str) -> None:
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
            return '/'.join(segments)

        db_table = self._DB_TABLE
        resource_id = get_next_resource_id(parent)
        self.name = get_name(parent, self._DB_TABLE, resource_id)
        data = self._prepare_data()
        db_fields_name = ['parent', 'resource_id', 'data']
        sql = f"INSERT INTO {db_table} ({get_db_fields_str(db_fields_name)}) VALUES "\
            f"({get_db_fields_placeholder_str(db_fields_name)})"
        params = {
            'parent': parent,
            'resource_id': resource_id,
            data: data
        }
        run_sql_with_param(sql, params)

    @classmethod
    def from_name(cls, name: str) -> DbModelBase:
        db_table = cls._DB_TABLE
        NAME_PATTERN = r'((?P<parent>.+)/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
        match = re.fullmatch(NAME_PATTERN, name)
        if not match or match['collection'] != cls._DB_TABLE:
            raise ValueError(f'{name} is not a valid resource name in {cls._DB_TABLE}')
        parent, resource_id = match['parent'], match['resource_id']
        sql = f'SELECT data FROM {db_table} '\
            f"WHERE {get_db_fields_assignment_str(['parent', 'resource_id'])}"
        params = {'parent': parent, 'resource_id': resource_id}
        data: Dict = run_sql_with_param_and_fetch_one(
            sql, params)[0]
        if not resp:
            raise NotFound(f'{params} can not be found in table={db_table}')
        obj_args = {}
        for field in cls._DB_DATA_FIELDS:
            obj_args[field.model_path] = data[field.name]
        return cls(**obj_args)

    @classmethod
    def list(cls) -> Iterable[DbModelBase]:
        ...

    def update(self) -> None:
        ...

    def delete(self) -> None:
        ...

    def _prepare_data(self) -> Dict:
        data = {}
        for field in self._DB_DATA_FIELDS:
            data[field.name] = field.converter.from_model(
                getattr(self, field.model_path))
        return data


def init_db_model(cls: type, db_table: str) -> None:
    cls._DB_TABLE = db_table
    pkeys = []
    db_fields = []
    for attribute in attr.fields(cls):
        if not attribute.metadata[base_core.IS_DB_FIELD]:
            continue
        converter: DbConverter = attribute.metadata[base_core.DB_CONVERTER]
        field = DbField(
            name=attribute.metadata[base_core.DB_PATH],
            converter=converter,
            model_path=attribute.name
        )
        db_fields.append(field)
    cls._DB_FIELDS = db_fields
