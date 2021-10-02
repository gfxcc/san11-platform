import logging
import os

from google.cloud import storage

logger = logging.getLogger(os.path.basename(__file__))

TMP_BUCKET = 'san11-tmp'
CANONICAL_BUCKET = 'san11-resources'

# Limits
PACKAGE_LIMIT_GB = 10


def move_file(src_bucket_name: str, src_filename: str, dest_bucket_name: str, dest_filename: str) -> None:
    storage_client = storage.Client()

    source_bucket = storage_client.bucket(src_bucket_name)
    source_blob = source_bucket.blob(src_filename)
    destination_bucket = storage_client.bucket(dest_bucket_name)

    source_bucket.copy_blob(
        source_blob, destination_bucket, dest_filename
    )
    logger.debug(f'({dest_filename}) is created in bucket {dest_bucket_name}')

    source_blob.delete()
    logger.debug(f'({src_filename}) is deleted from bucket {src_bucket_name}')


def _delete_file(bucket_name: str, filename: str) -> None:
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    bucket.blob(filename).delete()
    logger.debug(f'({filename}) is deleted from bucket {bucket_name}')


def _delete_folder(bucket_name: str, folder_path: str) -> None:
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blobs = bucket.list_blobs(prefix=folder_path)
    for blob in blobs:
        blob.delete()
        logger.debug(f'({blob}) is deleted from bucket {bucket_name}')


def disk_usage_under(prefix: str) -> int:
    '''
    Return size of all resources with give prefix under CANONICAL_BUCKET
    '''
    if os.environ.get('STAGE') == 'DEV':
        logger.debug(f'Skip gcs operations in env: DEV')
        return 0
    storage_client = storage.Client()
    blobs = storage_client.list_blobs(
        bucket_or_name=CANONICAL_BUCKET, prefix=prefix)
    return sum(blob.size for blob in blobs)


def get_file_size(bucket_name: str, filename: str) -> int:
    if os.environ.get('STAGE') == 'DEV':
        logger.debug(f'Skip gcs operations in env: DEV')
        return 0
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.get_blob(filename)
    return blob.size


def delete_resource(filename: str) -> None:
    _delete_file(CANONICAL_BUCKET, filename)


def delete_tmp_resource(filename: str) -> None:
    if os.environ.get('STAGE') == 'DEV':
        logger.debug(f'Skip gcs operations in env: DEV')
        return
    _delete_file(TMP_BUCKET, filename)


def delete_folder(folder_path: str) -> None:
    if os.environ.get('STAGE') == 'DEV':
        logger.debug(f'Skip gcs operations in env: DEV')
        return
    _delete_folder(CANONICAL_BUCKET, folder_path)
