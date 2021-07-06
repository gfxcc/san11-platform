from __future__ import annotations
from abc import abstractproperty, abstractclassmethod

from ..db import run_sql_with_param_and_fetch_one

class Category:
    def __init__(self, category_id: int, name: str) -> None:
        self.category_id = category_id
        self.name = name
    
    @classmethod
    def from_name(cls, name: str) -> Category:
        sql = 'SELECT category_id, name FROM categories WHERE name=%(name)s'
        resp = run_sql_with_param_and_fetch_one(sql, {'name': name})
        return cls(resp[0], resp[1])
    
    @classmethod
    def from_category_id(cls, category_id: int) -> Category:
        sql = 'SELECT category_id, name FROM categories WHERE category_id=%(category_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {'category_id': category_id})
        return cls(resp[0], resp[1])

    @classmethod
    def name_to_id(cls, name: str) -> int:
        return cls.from_name(name).category_id
    
    @classmethod
    def id_to_name(cls, id: int) -> str:
        return cls.from_category_id(id).name
