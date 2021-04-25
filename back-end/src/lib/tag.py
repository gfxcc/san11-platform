from typing import Iterable, List, Any

from .protos import san11_platform_pb2
from .resource import ResourceMixin
from .db.db_util import get_db_fields_str, get_db_fields_placeholder_str,\
                        run_sql_with_param_and_fetch_one, run_sql_with_param_and_fetch_all


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

    @classmethod
    def list(cls, page_size: int, page_token: str, **kwargs) -> Iterable[Any]:
        SUPPORTED_KEY = ['category_id']
        sql = f'SELECT {get_db_fields_str(cls.db_fields())} FROM {cls.db_table()}'
        constrains = []
        for key in SUPPORTED_KEY:
            if key in kwargs and kwargs[key]:
                constrains.append(f'{key}={kwargs[key]}')
        if constrains:
            sql = f"{sql} WHERE {' AND '.join(constrains)}"
        resp = run_sql_with_param_and_fetch_all(sql, {})
        return [cls(*item) for item in resp]
    
    def create(self) -> None:
        raise NotImplementedError()
    
    def delete(self) -> None:
        raise NotImplementedError()
    
    def to_pb(self) -> san11_platform_pb2.Tag:
        return san11_platform_pb2.Tag(
            tag_id=self.tag_id,
            name=self.name,
            category_id=self.category_id,
            mutable=self.mutable
        )
    