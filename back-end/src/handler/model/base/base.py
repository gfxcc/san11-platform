import datetime
from typing import Any, Callable, Dict, List, Optional, TypedDict, TypeVar

import attr

from . import base_core, base_db, base_proto


def Attrib(
        # proto section
        is_proto_field: bool = True,
        proto_path: Optional[str] = None,
        proto_converter: Optional[base_proto.ProtoConverter] = None,
        # db section
        is_db_field: bool = True,
        db_path: Optional[str] = None,
        db_converter: Optional[base_db.DbConverter] = None,
        # general section
        type: type = None,
        repeated: bool = False,
        # TODO: update type of nested_type to NestedModel
        nested_type: Optional[Any] = None,
        deprecated: bool = False,
        metadata: Optional[Dict[str, Any]] = None,
        **kwargs) -> attr.Attribute:
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
    if type is None and nested_type is None:
        raise ValueError(f'`type` must be specified')
    metadata = metadata or {}

    passthrough_types = [int, str, bool]
    if type in passthrough_types:
        if is_proto_field and proto_converter is None:
            proto_converter = base_proto.PassThroughConverter()
        if is_db_field and db_converter is None:
            db_converter = base_db.PassThroughConverter()
    elif type is datetime.datetime:
        if is_proto_field and proto_converter is None:
            proto_converter = base_proto.DatetimeProtoConverter()
        if is_db_field and db_converter is None:
            db_converter = base_db.DatetimeDbConverter()

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
    if repeated:
        type = List[type]
    
    if nested_type:
        metadata[base_core.NESTED_TYPE] = nested_type

    if deprecated:
        kwargs['default'] = None
    return attr.ib(metadata=metadata, type=type, **kwargs)


def NestedAttrib(nested_type: type, **kwargs) -> attr.Attribute:
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
                  proto_converter=base_proto.build_nested_converter(nested_type),
                  db_converter=base_db.build_nested_converter(nested_type),
                  **kwargs)


MODELS = {}
COLLECTION_TO_MODEL = {}


def InitModel(
    db_table: Optional[str],
    proto_class: Optional[Any],
) -> Callable:
    def wraps(cls):
        if issubclass(cls, base_db.DbModel):
            if not db_table:
                raise ValueError('db_table is required for subclass of DbModel')
            base_db.init_db_model(cls, db_table)
        if issubclass(cls, base_proto.ProtoModelBase):
            base_proto.init_proto_model(cls, proto_class)
        MODELS[cls.__name__] = cls
        COLLECTION_TO_MODEL[db_table] = cls
        return cls
    return wraps
