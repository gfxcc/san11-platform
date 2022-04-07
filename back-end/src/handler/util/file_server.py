from __future__ import annotations

import logging
import os
from abc import ABC, abstractproperty
from enum import Enum

from google.cloud import storage
from handler.common.env import Env, get_env
from handler.common.exception import NotFound

logger = logging.getLogger(os.path.basename(__file__))


# Limits
PACKAGE_SIZE_LIMIT = 10 * 1024 * 1024 * 1024  # 10 GB


def get_default_file_server() -> FileServer:
    return Gcs()


def get_file_server(server_type: FileServerType) -> FileServer:
    if server_type == FileServerType.Gcs:
        return Gcs()
    elif server_type == FileServerType.S3:
        return S3()
    else:
        raise ValueError(f'Unsupported FileServerType: {server_type}')


class FileServerType(Enum):
    Gcs = 1
    S3 = 2


class FileServer(ABC):
    @abstractproperty
    def resource_bucket(self) -> str:
        ...

    @abstractproperty
    def temp_bucket(self) -> str:
        ...

    # For file
    def get_file_size(self, bucket_name: str, filename: str) -> int:
        '''
        Get the size of the file in `bytes`.
        '''
        ...

    def move_file(self, src_bucket_name: str, src: str, dest_bucket_name: str, dest: str) -> None:
        '''
        Move a file within the server.
        '''
        ...

    def delete_file(self, bucket_name: str, filename: str) -> None:
        '''
        Delete the file from the server.
        '''
        ...

    # For folder
    def get_folder_size(self, bucket_name: str, path: str) -> int:
        '''
        Get the size of the folder in `bytes`.
        '''
        ...

    def delete_folder(self, bucket_name: str, path: str) -> None:
        '''
        Delete the folder from the server.
        '''
        ...


class Gcs(FileServer):
    @property
    def resource_bucket(self) -> str:
        return 'san11-resources'

    @property
    def temp_bucket(self) -> str:
        return 'san11-tmp'

    def get_file_size(self, bucket_name: str, filename: str) -> int:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return 0
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.get_blob(filename)
        if not blob:
            raise NotFound()
        return blob.size or 0

    def move_file(self, src_bucket_name: str, src: str, dest_bucket_name: str, dest: str) -> None:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return
        storage_client = storage.Client()
        source_bucket = storage_client.bucket(src_bucket_name)
        source_blob = source_bucket.blob(src)
        destination_bucket = storage_client.bucket(dest_bucket_name)

        source_bucket.copy_blob(
            source_blob, destination_bucket, dest
        )
        logger.debug(
            f'({dest}) is created in bucket {dest_bucket_name}')
        source_blob.delete()
        logger.debug(f'({src}) is deleted from bucket {src_bucket_name}')

    def delete_file(self, bucket_name: str, filename: str) -> None:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        bucket.blob(filename).delete()
        logger.debug(f'({filename}) is deleted from bucket {bucket_name}')

    def get_folder_size(self, bucket_name: str, path: str) -> int:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return 0
        storage_client = storage.Client()
        blobs = storage_client.list_blobs(
            bucket_or_name=bucket_name, prefix=path)
        return sum(blob.size for blob in blobs)

    def delete_folder(self, bucket_name: str, path: str) -> None:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return
        storage_client = storage.Client()
        bucket = storage_client.get_bucket(bucket_name)
        blobs = bucket.list_blobs(prefix=path)
        for blob in blobs:
            blob.delete()
            logger.debug(f'({blob}) is deleted from bucket {bucket_name}')


class S3(FileServer):
    ...
