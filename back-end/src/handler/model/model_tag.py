from __future__ import annotations

import attr
from handler.db.db_util import run_sql_with_param_and_fetch_one
from handler.model.activity import TrackLifecycle
from handler.model.base.base import Attrib, InitModel, ModelBase
from handler.model.tag import Tag

from ..protos import san11_platform_pb2 as pb


@InitModel(
    db_table='tags',
    proto_class=pb.Tag,
)
@attr.s
class ModelTag(ModelBase, TrackLifecycle):
    # Resource name. It is `{parent}/tags/{tag_id}/`
    # E.g. `categories/123/tags/456`
    name = Attrib(
        type=str,
    )
    tag_name = Attrib(
        type=str,
    )
    mutable = Attrib(
        type=bool,
    )

    @classmethod
    def from_v1(cls, legacy_model: Tag):
        return cls(
            name=f'categories/{legacy_model.category_id}/tags/{legacy_model.tag_id}',
            tag_name=legacy_model.tag_name,
            mutable=legacy_model.mutable,
        )

    @classmethod
    def from_id(cls, id: int):
        sql = f'SELECT parent, resource_id, data FROM tags WHERE resource_id={id}'
        resp = run_sql_with_param_and_fetch_one(sql, {})
        return cls(
            name=resp[2]['name'],
            tag_name=resp[2]['tag_name'],
            mutable=resp[2]['mutable'],
        )
