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
        deprecated: The field will be excluded from proto and db layer.
    '''
    if type is None:
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
        metadata[base_core.PROTO_PATH] = proto_path
        metadata[base_core.PROTO_CONVERTER] = proto_converter

    metadata[base_core.IS_DB_FIELD] = is_db_field
    if is_db_field:
        metadata[base_core.DB_PATH] = db_path
        metadata[base_core.DB_CONVERTER] = db_converter

    metadata[base_core.REPEATED] = repeated
    if repeated:
        type = List[type]

    if deprecated:
        kwargs['default'] = None
    return attr.ib(metadata=metadata, type=type, **kwargs)


MODELS = {}
COLLECTION_TO_MODEL = {}


def InitModel(
    db_table: str,
    proto_class: Optional[Any],
) -> Callable:
    def wraps(cls):
        base_db.init_db_model(cls, db_table)
        base_proto.init_proto_model(cls, proto_class)
        MODELS[cls.__name__] = cls
        COLLECTION_TO_MODEL[db_table] = cls
        return cls
    return wraps
