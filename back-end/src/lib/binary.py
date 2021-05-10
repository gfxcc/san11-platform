import json
import os
import logging
import psycopg2
import os
import os.path
import errno
from hurry.filesize import size
from typing import Any, Iterable, List, Union
from datetime import datetime, timezone

from .protos import san11_platform_pb2
from .resource import ResourceMixin
from .db import run_sql_with_param_and_fetch_one, run_sql_with_param, run_sql_with_param_and_fetch_all
from .version import Version
from .resource import get_resource_path, get_binary_url, create_resource
from .url import Url
from .time_util import datetime_to_str, get_datetime_format, get_now, get_timezone
from . import gcs


logger = logging.getLogger(os.path.basename(__file__))


class Binary(ResourceMixin):
    def __init__(self, binary_id: int, package_id: int, url: str, download_count: int,
                 version: str, description: str,
                 create_time: datetime, tag: str, download_method: str, size: str):
        self.binary_id = binary_id
        self.package_id = package_id
        self.url = url
        self.download_count = download_count
        self.version = version
        self.description = description
        self.create_time = create_time.replace(tzinfo=timezone.utc) if create_time.tzinfo is None else create_time
        self.tag = tag
        self.download_method = download_method
        self.size = size

    def __str__(self):
        return f'{{binary_id: {self.binary_id}, url: {self.url}, download_method: {self.download_method}}}'
    
    @property
    def url(self) -> str:
        return self._url
    
    @url.setter
    def url(self, url: str) -> None:
        self._url = url
    
    @classmethod
    def db_table(cls) -> str:
        return 'binaries'
    
    @classmethod
    def db_fields(cls) -> Iterable[str]:
        return ['binary_id', 'package_id', 'url', 'download_count', 'version', 
                'description', 'create_time', 'tag', 'download_method', 'size']

    @classmethod
    def from_pb(cls, obj: san11_platform_pb2.Binary):
        return cls(binary_id=obj.binary_id,
                   package_id=obj.package_id,
                   url=obj.url,
                   download_count=obj.download_count or 0,
                   version=str(Version.from_pb(obj.version)),
                   description=obj.description,
                   create_time=get_now(),
                   tag=obj.tag,
                   download_method=obj.download_method,
                   size=obj.size
                   )

    def delete(self) -> None:
        sql = f'DELETE FROM {self.db_table()} WHERE {self.db_fields()[0]}=%(resource_id)s'
        run_sql_with_param(sql, {'resource_id': self.binary_id})
        self._remove_resource()
        logger.debug(f'{self} is deleted')

    def to_pb(self) -> san11_platform_pb2.Binary:
        # TODO: backfill size. Can be removed after couple weeks
        if self.url and not self.size:
            self.size = size(gcs.get_file_size(gcs.CANONICAL_BUCKET, self.url))
            sql = f'UPDATE {self.db_table()} SET size=%(size)s WHERE {self.db_fields()[0]}=%(resource_id)s'
            run_sql_with_param(sql, {
                'size': self.size,
                'resource_id': self.binary_id
            })
            
        return san11_platform_pb2.Binary(
            binary_id=self.binary_id,
            url=self.url,
            download_count=self.download_count,
            version=Version.from_str(self.version).to_pb(),
            description=self.description,
            create_time=datetime_to_str(self.create_time),
            tag=self.tag,
            download_method=self.download_method,
            size=self.size
        )

    def download(self) -> san11_platform_pb2.Binary:
        '''
        Return the data and increment the download_count by 1
        '''
        self._increment_download_count()
        return self.to_pb()

    def _remove_resource(self) -> None:
        gcs.delete_canonical_resource(self.url)


    def _increment_download_count(self):
        sql = f'UPDATE {self.db_table()} SET download_count=download_count+1 WHERE binary_id=%(binary_id)s'
        run_sql_with_param(sql, {'binary_id': self.binary_id})
