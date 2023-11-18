from __future__ import annotations

import datetime
import logging
import os
from abc import ABC
from typing import Any, Callable, Generic, Iterable, Type, TypeVar

import attrs
from google.protobuf import descriptor, message, timestamp_pb2

from ...util.time_util import datetime_to_str, get_age, get_now
from . import base_core

logger = logging.getLogger(os.path.basename(__file__))


_MODEL_T = TypeVar('_MODEL_T')
_PROTO_T = TypeVar('_PROTO_T')

_SUB_PROTO_MODEL_BASE_T = TypeVar(
    '_SUB_PROTO_MODEL_BASE_T', bound='ProtoModelBase')


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
        # Set value to now() if the datetime type field is uninitialized.
        if proto_value == timestamp_pb2.Timestamp():
            return get_now()
        return proto_value.ToDatetime()

    def from_model(self, value: datetime.datetime) -> timestamp_pb2.Timestamp:
        proto_value = timestamp_pb2.Timestamp()
        if not value:
            return proto_value
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
        return get_age(value)


@attrs.define
class NestedProtoConverter(ProtoConverter):
    from_model_exec: Callable[[Any], Any] = lambda x: x
    to_model_exec: Callable[[Any], Any] = lambda x: x

    def from_model(self, value: _MODEL_T) -> _PROTO_T:
        return self.from_model_exec(value)

    def to_model(self, proto_value: _PROTO_T) -> _MODEL_T:
        return self.to_model_exec(proto_value)


def build_nested_converter(cls: Type[_SUB_PROTO_MODEL_BASE_T]):
    return NestedProtoConverter(from_model_exec=lambda v: v.to_pb(), to_model_exec=cls.from_pb)


@attrs.define(auto_attribs=True)
class ProtoField:
    name: str
    converter: ProtoConverter
    model_path: str


class ProtoModelBase(ABC):
    _PROTO_CLASS: type
    _PROTO_FIELDS: Iterable[attrs.Attribute] = []

    @classmethod
    def from_pb(cls: Type[_SUB_PROTO_MODEL_BASE_T], proto_model: message.Message) -> _SUB_PROTO_MODEL_BASE_T:
        '''
        Construct a data model from its protobuf message representation.
        '''
        properties = {}
        for attribute in attrs.fields(cls):
            if not attribute.metadata[base_core.IS_PROTO_FIELD]:
                # None proto field still needs to be set to initiazlie the
                # model properly.
                properties[attribute.name] = None
                continue
            path = _get_proto_path(attribute)
            proto_value = _get_by_path(
                proto_model, path, proto_model.DESCRIPTOR.fields_by_name[path])
            properties[attribute.name] = _attribute_from_pb(
                attribute, proto_value)
        return cls(**properties)

    def to_pb(self) -> message.Message:
        '''
        Returns the data model's protobuf representation.
        '''
        proto_model = self._PROTO_CLASS()
        for attribute in attrs.fields(type(self)):
            if not attribute.metadata[base_core.IS_PROTO_FIELD]:
                continue
            model_value = getattr(self, attribute.name)
            if model_value is None:
                continue
            path = _get_proto_path(attribute)
            field_descriptor = proto_model.DESCRIPTOR.fields_by_name[path]
            proto_value = _attribute_to_proto(attribute, model_value)

            # Do not set proto field if value is Falsy.
            #   - To be back compatible with legacy data model where None is stored in db fields.
            #   - To prevent accidentally clear other oneof fields.
            if not proto_value:
                continue

            if attribute.metadata[base_core.REPEATED]:
                if field_descriptor.type == descriptor.FieldDescriptor.TYPE_MESSAGE:
                    del getattr(proto_model, path)[:]
                    for item in proto_value:
                        getattr(proto_model, path).append(item)
                else:
                    getattr(proto_model, path)[:] = proto_value
            else:
                if field_descriptor.type == descriptor.FieldDescriptor.TYPE_MESSAGE:
                    getattr(proto_model, path).CopyFrom(proto_value)
                else:
                    setattr(proto_model, path, proto_value)

        return proto_model


def init_proto_model(cls: Type[_SUB_PROTO_MODEL_BASE_T], proto_class) -> None:
    cls._PROTO_CLASS = proto_class
    for attribute in attrs.fields(cls):
        if not attribute.metadata[base_core.IS_PROTO_FIELD]:
            continue


def _attribute_pb_converter(attribute: attrs.Attribute) -> ProtoConverter:
    converter: ProtoConverter = attribute.metadata.get(
        base_core.PROTO_CONVERTER)  # type: ignore
    return converter or PassThroughConverter()


def _attribute_from_pb(attribute: attrs.Attribute, proto_value: Any) -> Any:
    converter = _attribute_pb_converter(attribute)

    if base_core.is_repeated(attribute):
        return [
            converter.to_model(item) for item in proto_value]
    else:
        # To handle the case where proto field is not set.
        if proto_value is None:
            return None
        return converter.to_model(proto_value)


def _attribute_to_proto(attribute: attrs.Attribute, model_value: Any) -> Any:
    converter: ProtoConverter = _attribute_pb_converter(attribute)
    if attribute.metadata[base_core.REPEATED]:
        ret = [converter.from_model(v) for v in model_value]
    else:
        if model_value is None:
            return None
        ret = converter.from_model(model_value)
    return ret


def _get_by_path(proto: message.Message, path: str, descriptor: descriptor.FieldDescriptor) -> Any:
    # TODO: Following logic needs to be updated if optional keyword is used.
    if oneof_desc := descriptor.containing_oneof:
        if not proto.HasField(path):
            return None
    value = proto
    for item in path.split('.'):
        value = getattr(value, item)
    return value


def _set_by_path(proto: message.Message, path: str, proto_value: Any) -> None:
    pass


def _get_proto_path(attribute: attrs.Attribute) -> str:
    return attribute.metadata.get(base_core.PROTO_PATH, attribute.name)


def _is_proto_field(attribute: attrs.Attribute) -> bool:
    return attribute.metadata[base_core.IS_PROTO_FIELD]
