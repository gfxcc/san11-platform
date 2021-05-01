from typing import Iterable, List, Any

from .protos import san11_platform_pb2
from .resource import ResourceMixin
from .db.db_util import get_db_fields_str, get_db_fields_placeholder_str, run_sql_with_param,\
                        run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all
from .exception import PermissionDenied


class Tag(ResourceMixin):
    def __init__(self, tag_id: int, name: str, category_id: int, mutable: bool):
        self.tag_id = tag_id
        self.name = name
        self.category_id = category_id
        self.mutable = mutable
    
    @property
    def url(self) -> str:
        return f'categories/{self.category_id}/tags/{self.tag_id}'
    
    @classmethod
    def db_table(cls) -> str:
        return 'tags'

    @classmethod
    def db_fields(cls):
        return ['tag_id', 'name', 'category_id', 'mutable']
    
    @classmethod
    def from_id(cls, id: int):
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()} '\
            'WHERE tag_id=%(id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'id': id
        })
        return cls(*resp)
    
    @classmethod
    def from_pb(cls, pb_obj: san11_platform_pb2.Tag):
        return cls(tag_id=pb_obj.tag_id,
                   name=pb_obj.name,
                   category_id=pb_obj.category_id,
                   mutable=pb_obj.mutable)

    def create(self) -> None:
        sql = f'INSERT INTO {self.db_table()} ({get_db_fields_str(self.db_fields())}) VALUES '\
            f'( COALESCE((SELECT MAX(tag_id) FROM {self.db_table()})+1, 1), '\
            f'{get_db_fields_placeholder_str(self.db_fields()[1:])}) RETURNING tag_id'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'name': self.name,
            'category_id': self.category_id,
            'mutable': True
        })
        self.tag_id = resp[0]
    
    def delete(self) -> None:
        if self.in_use():
            raise PermissionDenied('请先将标签从所有工具中移除')
        sql = f'DELETE FROM {self.db_table()} WHERE tag_id=%(tag_id)s'
        run_sql_with_param(sql, {
            'tag_id': self.tag_id
        })
    
    def to_pb(self) -> san11_platform_pb2.Tag:
        return san11_platform_pb2.Tag(
            tag_id=self.tag_id,
            name=self.name,
            category_id=self.category_id,
            mutable=self.mutable
        )
    
    def in_use(self) -> bool:
        '''
        Returns:
            true: if this tag is associated on packages.
            false: no package has this tag
        '''
        sql = 'SELECT count(*) FROM packages WHERE %(tag_id)s=ANY(tag_ids)'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'tag_id': self.tag_id
        })
        return resp[0] > 0