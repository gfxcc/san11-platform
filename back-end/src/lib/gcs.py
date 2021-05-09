import logging, os
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


def delete_file(bucket_name: str, filename: str) -> None:
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    bucket.blob(filename).delete()
    logger.debug(f'({filename}) is deleted from bucket {bucket_name}')


def delete_canonical_resource(url: str) -> None:
    delete_file(CANONICAL_BUCKET, url)


def disk_usage_under(prefix: str) -> int:
    '''
    Return size of all resources with give prefix under CANONICAL_BUCKET
    '''
    storage_client = storage.Client()
    blobs = storage_client.list_blobs(bucket_or_name=CANONICAL_BUCKET, prefix=prefix)
    return sum(blob.size for blob in blobs)


def get_file_size(bucket_name: str, filename: str) -> str:
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(filename)
    return blob.size