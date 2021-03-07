import os
import logging
import psycopg2
from typing import Any

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_one, run_sql_with_param
from .version import Version



logger = logging.getLogger(os.path.basename(__file__))


class Binary:
    def __init__(self, binary_id: int, download_count: int, 
                 version: Version, description: str, data: bytes):
        self.binary_id = binary_id
        self.download_count = download_count
        self.version = version
        self.description = description
        self.data = data
    
    def __str__(self):
        return f'{{binary_id: {self.binary_id}}}'
    
    def download(self) -> bytes:
        '''
        Return the data and increment the download_count by 1
        '''
        self._increment_download_count()
        logger.debug(f'{self} is downloaded')
        return self.to_pb()
    
    def persist(self) -> None:
        assert not self.binary_id 
        sql = 'INSERT INTO binaries VALUES (DEFAULT, DEFAULT, %(version)s, %(description)s, %(data)s) RETURNING binary_id'
        resp = run_sql_with_param_and_fetch_one(sql, {
            'version': str(self.version),
            'description': self.description,
            'data': self.data
        })
        self.binary_id = resp[0]
    
    def to_pb(self) -> san11_platform_pb2.Binary:
        return san11_platform_pb2.Binary(
            binary_id=self.binary_id,
            download_count=self.download_count,
            version=self.version.to_pb(),
            description=self.description,
            data=self.data
        )

    @classmethod
    def from_pb(cls, obj):
        return cls(binary_id=obj.binary_id, 
                   download_count=obj.download_count,
                   version=Version.from_pb(obj.version),
                   description=obj.description,
                   data=obj.data)

    @classmethod
    def from_binary_id(cls, binary_id):
        sql = 'SELECT download_count, version, description, data FROM binaries WHERE binary_id=%(binary_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {'binary_id': binary_id})
        if resp is None:
            raise LookupError(f'Invalid binary_id:{binary_id}')
        download_count, version_str, description, data = resp
        return cls(binary_id, download_count, Version.from_str(version_str), description, data.tobytes())

    @classmethod
    def create(cls: int, version: str, description: str, data: bytes):
        sql = 'INSERT INTO binary VALUES (DEFAULT, 0, %(version)s, %(description)s, %(data)s) returning id'
        binary_id = run_sql_with_param_and_fetch_one(sql, {
            'version': version,
            'description': description,
            'data': psycopg2.Binary(data)
        })[0]
        return cls(binary_id, 0, version, description)
    
    def _increment_download_count(self):
        sql = 'UPDATE binaries SET download_count=download_count+1 WHERE binary_id=%(binary_id)s'
        run_sql_with_param(sql, {'binary_id': self.binary_id})
