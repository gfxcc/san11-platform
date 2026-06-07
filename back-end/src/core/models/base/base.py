import datetime
import typing
from typing import (Any, Callable, Dict, List, Optional, Type, TypeVar,
                    TypedDict, cast)

import attr
import attrs
from google.protobuf import message

from . import base_core, base_storage, base_proto

_FIELD_T = TypeVar('_FIELD_T')
_PROTO_INPUT_T = TypeVar('_PROTO_INPUT_T')
_PROTO_OUTPUT_T = TypeVar('_PROTO_OUTPUT_T')
_STORAGE_INPUT_T = TypeVar('_STORAGE_INPUT_T')
_STORAGE_OUTPUT_T = TypeVar('_STORAGE_OUTPUT_T')


def Attrib(
        # proto section
        is_proto_field: bool = True,
        proto_path: Optional[str] = None,
        proto_converter: Optional[
            base_proto.ProtoConverter[
                _FIELD_T, _PROTO_INPUT_T, _PROTO_OUTPUT_T]] = None,
        # db section
        is_db_field: bool = True,
        db_path: Optional[str] = None,
        db_converter: Optional[
            base_storage.StorageConverter[
                _FIELD_T, _STORAGE_INPUT_T, _STORAGE_OUTPUT_T]] = None,
        # general section
        repeated: bool = False,
        # TODO: update type of nested_type to NestedModel
        nested_type: Optional[Any] = None,
        deprecated: bool = False,
        metadata: Optional[Dict[str, Any]] = None,
        **kwargs) -> _FIELD_T:
    '''
    Args:
        # Proto section
        is_proto_field: True if this attribute is a field in proto message. 
            Arguments in proto section take effect only if this is True.
        proto_path: field name of the attribute in its proto message.
        proto_converter: converter to converte this attribute between proto message and internal Model.

        # Db section
        is_db_field: True if this attribute is a field in database schema.
            Arguments in db section take effect only if this is True.
        db_path: field name of this attribute in database schema.
        db_converter: converter to converte this attribute between internal Model and database field.
        is_serial_id: True if this attribute is used in database as a serial increasing id.
            A model class can have at most 1 attribute as serial_id.
        is_pkey: True if this db field is the primary key for the row.
            The data model of a table should be: (pkey1, pkey2, ..., data_in_json)

        # General section
        nested_type: The python class of the nested type.
        deprecated: The field will be excluded from proto and db layer.
    '''
    metadata = metadata or {}

    metadata[base_core.IS_PROTO_FIELD] = is_proto_field
    if is_proto_field:
        if proto_path:
            metadata[base_core.PROTO_PATH] = proto_path
        metadata[base_core.PROTO_CONVERTER] = proto_converter

    metadata[base_core.IS_DB_FIELD] = is_db_field
    if is_db_field:
        if db_path:
            metadata[base_core.DB_PATH] = db_path
        metadata[base_core.DB_CONVERTER] = db_converter

    metadata[base_core.REPEATED] = repeated

    if nested_type:
        metadata[base_core.NESTED_TYPE] = nested_type

    if deprecated:
        kwargs['default'] = None
    return cast(_FIELD_T, attrs.field(metadata=metadata, **kwargs))


def NestedAttrib(nested_type: Type[_FIELD_T], **kwargs) -> _FIELD_T:
    '''
    Provide a nested attribute.
    E.g. The UserSettings fields in the following User message.
    message User {
        int64 user_id = 1;
        UserSettings settings = 2;

        message UserSettings {
            ...
        }
    }
    '''
    return Attrib(nested_type=nested_type,
                  proto_converter=cast(
                      base_proto.ProtoConverter[
                          _FIELD_T, message.Message, message.Message],
                      base_proto.build_nested_converter(
                          cast(Type[base_proto.ProtoSerializable], nested_type))),
                  db_converter=cast(
                      base_storage.StorageConverter[_FIELD_T, Dict, Dict],
                      base_storage.build_nested_converter(
                          cast(Type[base_storage.StorageSerializable], nested_type))),
                  **kwargs)


def BoolAttrib(**kwargs) -> bool:
    return cast(bool, Attrib(
        **kwargs,
    ))


def BoolListAttrib(**kwargs) -> List[bool]:
    return cast(List[bool], BoolAttrib(
        repeated=True,
        **kwargs,
    ))


def IntAttrib(**kwargs) -> int:
    return cast(int, Attrib(
        **kwargs,
    ))


def IntListAttrib(**kwargs) -> List[int]:
    return cast(List[int], IntAttrib(
        repeated=True,
        **kwargs,
    ))


def StrAttrib(**kwargs) -> str:
    return cast(str, Attrib(
        **kwargs,
    ))


def StrListAttrib(**kwargs) -> List[str]:
    return cast(List[str], StrAttrib(
        repeated=True,
        **kwargs,
    ))


def DatetimeAttrib(
        proto_converter: Optional[
            base_proto.ProtoConverter[datetime.datetime, Any, Any]] = None,
        db_converter: Optional[
            base_storage.StorageConverter[datetime.datetime, Any, Any]] = None,
        **kwargs) -> datetime.datetime:
    return cast(datetime.datetime, Attrib(
        proto_converter=proto_converter or base_proto.DatetimeProtoConverter(),
        db_converter=db_converter or base_storage.DatetimeStorageConverter(),
        **kwargs,
    ))


def DatetimeListAttrib(**kwargs) -> List[datetime.datetime]:
    return cast(List[datetime.datetime], DatetimeAttrib(repeated=True))


MODELS = {}
COLLECTION_TO_MODEL = {}


def InitModel(
    db_table: Optional[str],
    proto_class: type,
) -> Callable:
    def wraps(cls):
        if db_table:
            base_storage.init_storage_model(cls, db_table)
        if issubclass(cls, base_proto.ProtoSerializable):
            base_proto.init_proto_serializable(cls, proto_class)
        MODELS[cls.__name__] = cls
        if db_table:
            COLLECTION_TO_MODEL[db_table] = cls
        return cls
    return wraps
