from __future__ import annotations

from typing import List, Optional, Tuple

import attr
from handler.db.db_util import run_sql_with_param_and_fetch_one
from handler.model.base import Attrib, InitModel, ModelBase
from handler.model.base.base_db import ListOptions
from handler.model.model_activity import TrackLifecycle

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

    def delete(self, user_id: Optional[int] = None) -> None:
        return super().delete(user_id)

    @classmethod
    def from_id(cls, id: int):
        sql = f'SELECT parent, resource_id, data FROM tags WHERE resource_id={id}'
        resp = run_sql_with_param_and_fetch_one(sql, {})
        return cls(
            name=resp[2]['name'],
            tag_name=resp[2]['tag_name'],
            mutable=resp[2]['mutable'],
        )

    @classmethod
    def from_name(cls, name: str) -> ModelTag:
        return super().from_name(name)

    @classmethod
    def list(cls, list_options: ListOptions) -> Tuple[List[ModelTag], str]:
        return super().list(list_options)
