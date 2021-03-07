from __future__ import annotations
from pathlib import Path

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_one, run_sql_with_param

class Image:
    def __init__(self, image_id: int, data: bytes) -> None:
        self.image_id = image_id
        self.data = data
    
    def to_pb(self) -> san11_platform_pb2.Image:
        return san11_platform_pb2.Image(image_id=self.image_id, data=self.data)

    def delete(self):
        sql = 'DELETE FROM images WHERE image_id=%(image_id)s'
        run_sql_with_param(sql, {'image_id': self.image_id})

    @classmethod
    def from_image_id(cls, image_id: int) -> Image:
        sql = 'SELECT image_id, data FROM images WHERE image_id=%(image_id)s' 
        resp = run_sql_with_param_and_fetch_one(sql, {'image_id': image_id})
        return cls(resp[0], resp[1].tobytes())
    
    @classmethod
    def create(cls, data: bytes) -> Image:
        '''
        '''
        sql = 'INSERT INTO images VALUES (DEFAULT, %(data)s) RETURNING image_id'
        resp = run_sql_with_param_and_fetch_one(sql, {'data': data})
        return cls(resp[0], data)
        
    @classmethod
    def san11_default(cls) -> Image:
        filename = '../resources/screenshots/san11-screenshot.jpg'
        data = Path(filename).read_bytes()
        return cls(0, data)