from __future__ import annotations

import logging
import os
from abc import ABC, abstractproperty
from enum import Enum

import boto3
from google.cloud import storage
from handler.common.credentials import get_aws_credentials
from handler.common.env import Env, get_env
from handler.common.exception import NotFound
from requests import delete

logger = logging.getLogger(os.path.basename(__file__))


# Limits
PACKAGE_SIZE_LIMIT = 10 * 1024 * 1024 * 1024  # 10 GB


class BucketClass(Enum):
    REGULAR = 1
    TEMP = 2


class FileServerType(Enum):
    GCS = 1
    S3 = 2


class FileServer(ABC):
    @abstractproperty
    def regular_bucket(self) -> str:
        ...

    @abstractproperty
    def temp_bucket(self) -> str:
        ...

    # For file
    def get_file_size(self, bucket_class: BucketClass, filename: str) -> int:
        '''
        Get the size of the file in `bytes`.
        '''
        ...

    def move_file(self, src_bucket_class: BucketClass, src: str,
                  dest_bucket_class: BucketClass, dest: str) -> None:
        '''
        Move a file within the server.
        '''
        ...

    def delete_file(self, bucket_class: BucketClass, filename: str) -> None:
        '''
        Delete the file from the server.
        '''
        ...

    # For folder
    def get_folder_size(self, bucket_class: BucketClass, path: str) -> int:
        '''
        Get the size of the folder in `bytes`.
        '''
        ...

    def delete_folder(self, bucket_class: BucketClass, path: str) -> None:
        '''
        Delete the folder from the server.
        '''
        ...

    # utilities
    def get_bucket_name(self, bucket_class: BucketClass) -> str:
        if bucket_class == BucketClass.REGULAR:
            return self.regular_bucket
        elif bucket_class == BucketClass.TEMP:
            return self.temp_bucket
        else:
            raise ValueError(f'Unsupported BucketClass: {bucket_class}')


class Gcs(FileServer):
    @property
    def regular_bucket(self) -> str:
        return 'san11-resources'

    @property
    def temp_bucket(self) -> str:
        return 'san11-tmp'

    def get_file_size(self, bucket_class: BucketClass, filename: str) -> int:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return 0
        storage_client = storage.Client()
        bucket = storage_client.bucket(self.get_bucket_name(bucket_class))
        blob = bucket.get_blob(filename)
        if not blob:
            raise NotFound()
        return blob.size or 0

    def move_file(self, src_bucket_class: BucketClass, src: str, dest_bucket_class: BucketClass, dest: str) -> None:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return
        storage_client = storage.Client()
        source_bucket = storage_client.bucket(
            self.get_bucket_name(src_bucket_class))
        source_blob = source_bucket.blob(src)
        destination_bucket = storage_client.bucket(
            self.get_bucket_name(dest_bucket_class))

        source_bucket.copy_blob(
            source_blob, destination_bucket, dest
        )
        logger.debug(
            f'({dest}) is created in bucket {dest_bucket_class}')
        source_blob.delete()
        logger.debug(f'({src}) is deleted from bucket {src_bucket_class}')

    def delete_file(self, bucket_class: BucketClass, filename: str) -> None:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return
        storage_client = storage.Client()
        bucket = storage_client.bucket(self.get_bucket_name(bucket_class))
        bucket.blob(filename).delete()
        logger.debug(f'({filename}) is deleted from bucket {bucket_class}')

    def get_folder_size(self, bucket_class: BucketClass, path: str) -> int:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return 0
        storage_client = storage.Client()
        blobs = storage_client.list_blobs(
            bucket_or_name=self.get_bucket_name(bucket_class), prefix=path)
        return sum(blob.size for blob in blobs)

    def delete_folder(self, bucket_class: BucketClass, path: str) -> None:
        if get_env() == Env.DEV:
            logger.debug(f'Skip gcs operations in env: DEV')
            return
        storage_client = storage.Client()
        bucket = storage_client.get_bucket(self.get_bucket_name(bucket_class))
        blobs = bucket.list_blobs(prefix=path)
        for blob in blobs:
            blob.delete()
            logger.debug(f'({blob}) is deleted from bucket {bucket_class}')


class S3(FileServer):

    def __init__(self) -> None:
        self.creds = get_aws_credentials()
        super().__init__()

    @property
    def regular_bucket(self) -> str:
        return 'san11-resources'

    @property
    def temp_bucket(self) -> str:
        return 'san11-tmp'

    def get_file_size(self, bucket_class: BucketClass, filename: str) -> int:
        client = self._get_client()
        meta = client.get_object_attributes(Bucket=self.get_bucket_name(bucket_class),
                                            Key=filename,
                                            ObjectAttributes=['ObjectSize'])
        return meta['ObjectSize']

    def move_file(self, src_bucket_class: BucketClass, src: str, dest_bucket_class: BucketClass, dest: str) -> None:
        client = self._get_client()
        client.copy_object(
            CopySource={
                'Bucket': self.get_bucket_name(src_bucket_class),
                'Key': src
            },
            Bucket=self.get_bucket_name(dest_bucket_class),
            Key=dest,
        )
        logger.debug(
            f'({dest}) is created in bucket {dest_bucket_class}')
        client.delete_object(
            Bucket=self.get_bucket_name(src_bucket_class),
            Key=src,
        )

    def delete_file(self, bucket_class: BucketClass, filename: str) -> None:
        client = self._get_client()
        client.delete_object(
            Bucket=self.get_bucket_name(bucket_class),
            Key=filename,
        )
        logger.debug(f'({filename}) is deleted from bucket {bucket_class}')

    def get_folder_size(self, bucket_class: BucketClass, path: str) -> int:
        bucket = self._get_client().Bucket(self.get_bucket_name(bucket_class))
        total_size = 0

        for obj in bucket.objects.filter(Prefix=path):
            total_size = total_size + obj.size

        return total_size

    def delete_folder(self, bucket_class: BucketClass, path: str) -> None:
        bucket = self._get_client().Bucket(self.get_bucket_name(bucket_class))
        bucket.objects.filter(Prefix=path).delete()

    def _get_client(self):
        return boto3.client('s3', aws_access_key_id=self.creds.access_key_id,
                            aws_secret_access_key=self.creds.secret_access_key,
                            region_name='ap-east-1')


def get_file_server(server_type: FileServerType = FileServerType.GCS) -> FileServer:
    if server_type == FileServerType.GCS:
        return Gcs()
    elif server_type == FileServerType.S3:
        return S3()
    else:
        raise ValueError(f'Unsupported FileServerType: {server_type}')


def get_default_file_server() -> FileServer:
    return Gcs()
