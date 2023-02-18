
from typing import List, Optional, Tuple

import attrs

from handler.db.db_util import run_sql_with_param_and_fetch_one
from handler.model.base import (Attrib, BoolAttrib, InitModel, ListOptions,
                                ModelBase, StrAttrib)
from handler.model.plugins.tracklifecycle import TrackLifecycle

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='tags',
    proto_class=pb.Tag,
)
@attrs.define
class ModelTag(TrackLifecycle, ModelBase):
    # Resource name. It is `{parent}/tags/{tag_id}/`
    # E.g. `categories/123/tags/456`
    name: str = StrAttrib()
    tag_name: str = StrAttrib()
    mutable: bool = BoolAttrib()

    @classmethod
    def from_id(cls, id: int):
        sql = f'SELECT parent, resource_id, data FROM tags WHERE resource_id={id}'
        resp = run_sql_with_param_and_fetch_one(sql, {})
        return cls(
            name=resp[2]['name'],
            tag_name=resp[2]['tag_name'],
            mutable=resp[2]['mutable'],
        )
