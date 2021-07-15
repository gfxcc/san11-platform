from __future__ import annotations
import datetime
from handler import model
from handler.model.base import base_core
import attr
from abc import ABC
from typing import Any, Generic, Iterable, TypeVar
from google.protobuf import timestamp_pb2, message


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
    def from_proto(self, proto_value: timestamp_pb2.Timestamp) -> datetime.datetime:
        return proto_value.ToDatetime()

    def to_proto(self, value: datetime.datetime) -> timestamp_pb2.Timestamp:
        proto_value = timestamp_pb2.Timestamp()
        proto_value.FromDatetime(value)
        return proto_value



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
            path = attribute.metadata[base_core.PROTO_PATH]
            converter: ProtoConverter = attribute.metadata[base_core.PROTO_CONVERTER]
            proto_value = getattr(proto_model, path)
            properties[attribute.name] = converter.from_proto(proto_value)
        return cls(**properties)

    def to_pb(self) -> message.Message:
        proto_model = self._PROTO_CLASS()
        for attribute in attr.fields(type(self)):
            if not attribute.metadata[base_core.IS_PROTO_FIELD]:
                continue
            model_value = getattr(self, attribute.name)
            path = attribute.metadata[base_core.PROTO_PATH]
            proto_value = _attribute_to_proto(attribute, model_value)

            if attribute.metadata[base_core.REPEATED]:
                getattr(proto_model, path)[:] = proto_value
            else:
                setattr(proto_model, path, proto_value)

        return proto_model


def init_proto_model(cls: type, proto_class) -> None:
    cls._PROTO_CLASS = proto_class


def _attribute_to_proto(attribute: attr.Attribute, model_value: Any) -> Any:
    converter: ProtoConverter = attribute.metadata.get(
        base_core.PROTO_CONVERTER, PassThroughConverter())
    if attribute.metadata[base_core.REPEATED]:
        return [converter.from_model(v) for v in model_value]
    else:
        return converter.from_model(model_value)


def _get_by_path(proto: message.Message, path: str) -> Any:
    value = proto
    for item in path.split('.'):
        value = getattr(value, item)
    return value


def _set_by_path(proto: message.Message, path: str, proto_value: Any) -> None:
    pass
