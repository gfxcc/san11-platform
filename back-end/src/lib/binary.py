import os
import logging
import psycopg2
import os, os.path
import errno
from typing import Any

from .protos import san11_platform_pb2
from .db_util import run_sql_with_param_and_fetch_one, run_sql_with_param
from .version import Version
from .resource import get_resource_path, get_binary_url, create_resource


logger = logging.getLogger(os.path.basename(__file__))


class Binary:
    def __init__(self, binary_id: int, url: str, download_count: int, 
                 version: Version, description: str, tag: str):
        self.binary_id = binary_id
        self.url = url
        self.download_count = download_count
        self.version = version
        self.description = description
        self.tag = tag
    
    def __str__(self):
        return f'{{binary_id: {self.binary_id}, url: {self.url}}}'
    
    @property
    def version(self) -> Version:
        return self._version
    
    @version.setter
    def version(self, version):
        if isinstance(version, str):
            self._version = Version.from_str(version)
        elif isinstance(version, Version):
            self._version = version
        else:
            raise ValueError(f'Invalid version: {version}')
    
    def download(self) -> bytes:
        '''
        Return the data and increment the download_count by 1
        '''
        self._increment_download_count()
        logger.debug(f'{self} is downloaded')
        return self.to_pb()
    
    def delete(self) -> None:
        sql = 'DELETE FROM binaries WHERE binary_id=%(binary_id)s'
        run_sql_with_param(sql, {'binary_id': self.binary_id})
        self._remove_file()
        logger.debug(f'{self} is deleted')
    
    def _remove_file(self) -> None:
        os.remove(get_resource_path(self.url))
    
    def to_pb(self) -> san11_platform_pb2.Binary:
        return san11_platform_pb2.Binary(
            binary_id=self.binary_id,
            url=self.url,
            download_count=self.download_count,
            version=self.version.to_pb(),
            description=self.description,
            tag=self.tag
        )

    @classmethod
    def from_pb(cls, obj):
        return cls(binary_id=obj.binary_id, 
                   url=obj.url,
                   download_count=obj.download_count or 0,
                   version=Version.from_pb(obj.version),
                   description=obj.description,
                   tag=obj.tag)

    @classmethod
    def from_binary_id(cls, binary_id):
        sql = 'SELECT url, download_count, version, description, tag FROM binaries WHERE binary_id=%(binary_id)s'
        resp = run_sql_with_param_and_fetch_one(sql, {'binary_id': binary_id})
        if resp is None:
            raise LookupError(f'Invalid binary_id:{binary_id}')
        return cls(binary_id, *resp)

    @classmethod
    def createc_under_parent(cls, parent: str, pb_obj: san11_platform_pb2.Binary, data: bytes):
        obj = cls.from_pb(pb_obj)
        filename = f'{obj.version}.scp'
        obj.url = get_binary_url(parent, filename)

        sql = 'INSERT INTO binaries (url, download_count, version, description, tag) VALUES (%(url)s, %(download_count)s, %(version)s, %(description)s, %(tag)s) returning binary_id'
        binary_id = run_sql_with_param_and_fetch_one(sql, {
            'url': obj.url,
            'download_count': obj.download_count,
            'version': str(obj.version),
            'description': pb_obj.description,
            'tag': pb_obj.tag
        })[0]
        obj.binary_id = binary_id


        create_resource(obj.url, data)
        return obj
    
    def _increment_download_count(self):
        sql = 'UPDATE binaries SET download_count=download_count+1 WHERE binary_id=%(binary_id)s'
        run_sql_with_param(sql, {'binary_id': self.binary_id})
