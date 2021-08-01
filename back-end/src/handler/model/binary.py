import json
import os
import logging
import psycopg2
import os
import os.path
import errno
from typing import Any, Iterable, List, Union
from datetime import datetime, timezone

from ..protos import san11_platform_pb2
from .resource import ResourceMixin, ResourceView
from .activity import TrackLifecycle
from ..db import run_sql_with_param
from ..util.time_util import datetime_to_str, get_datetime_format, get_now, get_timezone
from ..util.size_util import human_readable
from ..util import gcs


logger = logging.getLogger(os.path.basename(__file__))


class Version:
    def __init__(self, major: int, minor: int, patch: int) -> None:
        self.major = major
        self.minor = minor
        self.patch = patch
    
    def __str__(self) -> str:
        return f'v{self.major}.{self.minor}.{self.patch}'
    
    def to_pb(self) -> san11_platform_pb2.Version:
        return san11_platform_pb2.Version(
            major=self.major,
            minor=self.minor,
            patch=self.patch
        )
    
    @classmethod
    def from_pb(cls, obj: san11_platform_pb2.Version):
        return cls(major=obj.major,
                   minor=obj.minor,
                   patch=obj.patch)
                
    @classmethod
    def from_str(cls, obj: str):
        return cls(*list(map(int, obj[1:].split('.'))))


class Binary(ResourceMixin, TrackLifecycle):
    # TODO: replace `package_id` with `parent` in presentation layer.
    #       Should continually keep `package_id` in DB as a primary key.
    def __init__(self, binary_id: int, package_id: int, url: str, download_count: int,
                 version: str, description: str,
                 create_time: datetime, tag: str, download_method: str, size: str, parent: str):
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
        self.parent = parent

    def __str__(self):
        return f'{{binary_id: {self.binary_id}, url: {self.url}, download_method: {self.download_method}}}'
    
    @property
    def url(self) -> str:
        '''
        [DEPRECATED]
        Please use `name`.
        '''
        return self._url
    
    @property
    def name(self) -> str:
        if not self.id:
            raise ValueError('Binary is not ready/created. self.id is not available.')
        return f'{self.parent}/binaries/{self.id}'
    
    # TODO: remove backfill logic
    @property
    def parent(self) -> str:
        return self._parent
    
    @parent.setter
    def parent(self, parent: str) -> None:
        sql = f'UPDATE {self.db_table()} SET parent=%(parent)s WHERE binary_id=%(resource_id)s'
        run_sql_with_param(sql, {
            'parent': parent,
            'resource_id': self.id
        })
        self._parent = parent
    # TODO: END
    
    @name.setter
    def name(self, name: str) -> None:
        '''
        TODO: Only for backfill. Should be removed once it is done.
        '''
        sql = f'UPDATE {self.db_table()} SET name=%(name)s WHERE binary_id=%(binary_id)s'
        run_sql_with_param(sql, {
            'name': name,
            'binary_id': self.id
        })
        self._name = name
    
    @property
    def id(self) -> int:
        return self.binary_id
    
    @property
    def view(self) -> ResourceView:
        return ResourceView(
            name='/'.join(self.name.split('/')[:-2]),  # link of package
            # TODO: provide a more readable display_name
            display_name=self.name,
            description=None,
            image_url=None
        )
    
    @url.setter
    def url(self, url: str) -> None:
        self._url = url
    
    @classmethod
    def db_table(cls) -> str:
        return 'binaries_legacy'
    
    @classmethod
    def db_fields(cls) -> Iterable[str]:
        return ['binary_id', 'package_id', 'url', 'download_count', 'version', 
                'description', 'create_time', 'tag', 'download_method', 'size', 'parent']
    
    @classmethod
    def name_pattern(cls) -> str:
        return r'categories/[0-9]+/packages/[0-9]+/binaries/[0-9]+'

    @classmethod
    def from_pb(cls, obj: san11_platform_pb2.Binary, parent: str):
        return cls(binary_id=obj.binary_id,
                   package_id=obj.package_id,
                   url=obj.url,
                   download_count=obj.download_count or 0,
                   version=str(Version.from_pb(obj.version)),
                   description=obj.description,
                   create_time=get_now(),
                   tag=obj.tag,
                   download_method=obj.download_method,
                   size=obj.size,
                   parent=parent
                   )

    def delete(self, user_id: int) -> None:
        self.remove_resource()
        super().delete(user_id=user_id)
    
    def to_pb(self) -> san11_platform_pb2.Binary:
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

    def remove_resource(self) -> None:
        if self.url:
            gcs.delete_canonical_resource(self.url)
            self.size = ''

    def _increment_download_count(self):
        sql = f'UPDATE {self.db_table()} SET download_count=download_count+1 WHERE binary_id=%(binary_id)s'
        run_sql_with_param(sql, {'binary_id': self.binary_id})
