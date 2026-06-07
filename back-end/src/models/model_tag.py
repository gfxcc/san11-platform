
from typing import List, Optional, Tuple

import attrs

from integrations.db.db_util import run_sql_with_param_and_fetch_one
from core.models.base import (Attrib, BoolAttrib, InitModel, ListOptions,
                                ModelBase, StrAttrib)
from models.plugins.tracklifecycle import TrackLifecycle

from app.protos import san11_platform_pb2 as pb


@InitModel(
    db_table='tags',
    proto_class=pb.Tag,
)
@attrs.define
class ModelTag(TrackLifecycle, ModelBase[pb.Tag]):
    # Resource name. It is `{parent}/tags/{tag_id}/`
    # E.g. `categories/123/tags/456`
    name: str = StrAttrib()
    tag_name: str = StrAttrib()
    mutable: bool = BoolAttrib()

    @classmethod
    def from_id(cls, id: int):
        sql = f'SELECT parent, resource_id, data FROM tags WHERE resource_id={id}'
        resp = run_sql_with_param_and_fetch_one(sql, {})
        if resp is None:
            raise KeyError(f'Tag {id} is not found')
        data = resp[2]
        return cls(
            name=data['name'],
            tag_name=data['tag_name'],
            mutable=data['mutable'],
        )
