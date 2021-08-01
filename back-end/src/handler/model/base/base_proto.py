from __future__ import annotations
import datetime
import logging
import os
import attr
from abc import ABC
from typing import Any, Generic, Iterable, TypeVar
from google import protobuf
from google.protobuf import timestamp_pb2, message, descriptor

from ...util.time_util import datetime_to_str, get_now
from . import base_core


logger = logging.getLogger(os.path.basename(__file__))


_MODEL_T = TypeVar('_MODEL_T')
_PROTO_T = TypeVar('_PROTO_T')


class ProtoConverter(Generic[_MODEL_T, _PROTO_T]):
    '''Convert attribute between value and proto_value'''

    def to_model(self, proto_value: _PROTO_T) -> _MODEL_T:
        raise NotImplementedError()

    def from_model(self, value: _MODEL_T) -> _PROTO_T:
        raise NotImplementedError()


class PassThroughConverter(ProtoConverter[Any, Any]):
    def to_model(self, proto_value: Any) -> Any:
        return proto_value

    def from_model(self, value: Any) -> Any:
        return value


class DatetimeProtoConverter(ProtoConverter[datetime.datetime, timestamp_pb2.Timestamp]):
    def to_model(self, proto_value: timestamp_pb2.Timestamp) -> datetime.datetime:
        if proto_value == timestamp_pb2.Timestamp():
            return get_now()
        return proto_value.ToDatetime()

    def from_model(self, value: datetime.datetime) -> timestamp_pb2.Timestamp:
        proto_value = timestamp_pb2.Timestamp()
        proto_value.FromDatetime(value)
        return proto_value


class LegacyDatetimeProtoConverter(ProtoConverter[datetime.datetime, timestamp_pb2.Timestamp]):
    '''
    For legacy proto message which datetime field is represented as string.
    '''

    def to_model(self, proto_value: timestamp_pb2.Timestamp) -> datetime.datetime:
        # Legacy datetime does not support to_model.
        return get_now()

    def from_model(self, value: datetime.datetime) -> str:
        return datetime_to_str(value)


@attr.s(auto_attribs=True)
class ProtoField:
    name: str
    converter: ProtoConverter
    model_path: str


class ProtoModelBase(ABC):
    _PROTO_CLASS = None
    _PROTO_FIELDS: Iterable[attr.Attribute] = []

    @classmethod
    def from_pb(cls, proto_model: message.Message) -> ProtoModelBase:
        properties = {}
        for attribute in attr.fields(cls):
            if not attribute.metadata[base_core.IS_PROTO_FIELD]:
                continue
            path = _get_proto_path(attribute)
            converter: ProtoConverter = attribute.metadata[base_core.PROTO_CONVERTER]
            field_descriptor = proto_model.DESCRIPTOR.fields_by_name[path]
            proto_value = _get_by_path(proto_model, path, field_descriptor)
            properties[attribute.name] = converter.to_model(proto_value)
        return cls(**properties)

    def to_pb(self) -> message.Message:
        proto_model = self._PROTO_CLASS()
        for attribute in attr.fields(type(self)):
            if not attribute.metadata[base_core.IS_PROTO_FIELD]:
                continue
            model_value = getattr(self, attribute.name)
            path = _get_proto_path(attribute)
            field_descriptor = proto_model.DESCRIPTOR.fields_by_name[path]
            proto_value = _attribute_to_proto(attribute, model_value)

            # Do not set proto field if value is Falsy.
            #   - To be back compatible with legacy data model where None is stored in db fields.
            #   - To prevent accidentally clear other oneof fields.
            if not proto_value:
                continue

            if attribute.metadata[base_core.REPEATED]:
                getattr(proto_model, path)[:] = proto_value
            else:
                if field_descriptor.type == descriptor.FieldDescriptor.TYPE_MESSAGE:
                    getattr(proto_model, path).CopyFrom(proto_value)
                else:
                    setattr(proto_model, path, proto_value)

        return proto_model


def init_proto_model(cls: type, proto_class) -> None:
    cls._PROTO_CLASS = proto_class
    for attribute in attr.fields(cls):
        if not attribute.metadata[base_core.IS_PROTO_FIELD]:
            continue


def _attribute_to_proto(attribute: attr.Attribute, model_value: Any) -> Any:
    converter: ProtoConverter = attribute.metadata.get(
        base_core.PROTO_CONVERTER, PassThroughConverter())
    if attribute.metadata[base_core.REPEATED]:
        ret = [converter.from_model(v) for v in model_value]
    else:
        ret = converter.from_model(model_value)
    return ret


def _get_by_path(proto: message.Message, path: str, descriptor: descriptor.FieldDescriptor) -> Any:
    if oneof_desc := descriptor.containing_oneof:
        if not proto.HasField(path):
         return None
    value = proto
    for item in path.split('.'):
        value = getattr(value, item)
    return value


def _set_by_path(proto: message.Message, path: str, proto_value: Any) -> None:
    pass


def _get_proto_path(attribute: attr.Attribute) -> str:
    return attribute.metadata[base_core.PROTO_PATH] or attribute.name
