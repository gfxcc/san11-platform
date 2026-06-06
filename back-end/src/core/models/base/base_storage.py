from __future__ import annotations

import datetime
import logging
import os
import re
from abc import ABC
from dataclasses import dataclass
from typing import Any, Callable, Dict, Generic, Tuple, TypeVar, Union

import attrs

from core.errors.exceptions import InvalidArgument
from . import base_core
from .common.list_options import FieldTrait, PostgresAdaptor

logger = logging.getLogger(os.path.basename(__file__))

_MODEL_T = TypeVar('_MODEL_T')
_STORAGE_VALUE_T = TypeVar('_STORAGE_VALUE_T')
_SUB_STORAGE_SERIALIZABLE_T = TypeVar(
    '_SUB_STORAGE_SERIALIZABLE_T', bound='StorageSerializable')


class StorageConverter(Generic[_MODEL_T, _STORAGE_VALUE_T]):
    '''Convert an attribute between model value and storage value.'''

    def to_model(self, db_value: _STORAGE_VALUE_T) -> _MODEL_T:
        raise NotImplementedError()

    def from_model(self, value: _MODEL_T) -> _STORAGE_VALUE_T:
        raise NotImplementedError()


class PassThroughConverter(StorageConverter[Any, Any]):
    def to_model(self, db_value: Any) -> Any:
        return db_value

    def from_model(self, value: Any) -> Any:
        return value


class DatetimeStorageConverter(StorageConverter[datetime.datetime, str]):
    def to_model(self, db_value: str) -> datetime.datetime:
        if db_value:
            return datetime.datetime.fromisoformat(db_value).replace(tzinfo=datetime.timezone.utc)
        else:
            logger.warn(f'Invalid datetime field is encountered.')
            return datetime.datetime.now().replace(tzinfo=datetime.timezone.utc)

    def from_model(self, value: datetime.datetime) -> datetime.datetime:
        return value.astimezone(datetime.timezone.utc)


@attrs.define
class NestedStorageConverter(StorageConverter):
    from_model_exec: Callable[[Any], Any] = lambda x: x
    to_model_exec: Callable[[Any], Any] = lambda x: x

    def from_model(self, value: _MODEL_T) -> Union[_STORAGE_VALUE_T, None]:
        if value is None:
            return None
        return self.from_model_exec(value)

    def to_model(self, db_value: _STORAGE_VALUE_T) -> Union[_MODEL_T, None]:
        if db_value is None:
            return None
        return self.to_model_exec(db_value)


def build_nested_converter(cls: StorageSerializable):
    return NestedStorageConverter(from_model_exec=lambda v: v.to_db(), to_model_exec=cls.from_db)


@dataclass
class StorageField:
    name: str
    converter: StorageConverter
    model_path: str
    repeated: bool
    type: type


class StorageSerializable(ABC):
    @classmethod
    def from_db(cls, db_value: Dict) -> _SUB_STORAGE_SERIALIZABLE_T:
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


def parse_name(db_table: str, name: str) -> Tuple[str, int]:
    NAME_PATTERN = r'((?P<parent>.+)/)?(?P<collection>[a-zA-Z0-9]+)/(?P<resource_id>[0-9]+)'
    match = re.fullmatch(NAME_PATTERN, name)
    # Table name should equal to `collection` in most case. However, it is also
    # possible that table name is suffixed with `_legacy` due to data migration.
    if not match or match['collection'] not in db_table:
        raise InvalidArgument(
            f'{name} is not a valid resource name in {db_table}')
    return match['parent'] or '', int(match['resource_id'])


def build_resource_name(parent: str, collection_name: str, resource_id: int) -> str:
    segments = [collection_name, resource_id]
    if parent:
        segments.insert(0, parent)
    return '/'.join(map(str, segments))


def init_storage_model(cls: type, db_table: str) -> None:
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
    converter: StorageConverter = _attribute_db_converter(attribute)
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


def _attribute_db_converter(attribute: attrs.Attribute) -> StorageConverter:
    converter: StorageConverter = attribute.metadata.get(base_core.DB_CONVERTER)
    return converter or PassThroughConverter()
