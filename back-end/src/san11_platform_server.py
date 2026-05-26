from __future__ import annotations

import argparse
import logging
from concurrent import futures

import grpc
from google.cloud import logging as cloud_logging

from handler.common.env import is_prod
from handler.grpc_service_registration import register_san11_platform_servicer
from handler.san11_platform_servicer import San11PlatformServicer
from handler.service_dependencies import San11PlatformDependencies

DEFAULT_ADDRESS = '[::]:50051'
MAX_RECEIVE_MESSAGE_LENGTH_BYTES = 30 * 1024 * 1024
DEFAULT_MAX_WORKERS = 10


def create_server(
        dependencies: San11PlatformDependencies = None,
        max_workers: int = DEFAULT_MAX_WORKERS) -> grpc.Server:
    options = [('grpc.max_receive_message_length',
                MAX_RECEIVE_MESSAGE_LENGTH_BYTES)]
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=max_workers),
                         options=options)
    register_san11_platform_servicer(San11PlatformServicer(dependencies), server)
    return server


def serve(address: str = DEFAULT_ADDRESS) -> None:
    server = create_server()
    server.add_insecure_port(address)
    server.start()
    logging.info(f'Server started at {address}')
    server.wait_for_termination()


def init_log(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO

    if is_prod():
        client = cloud_logging.Client()
        client.setup_logging(log_level=level)
    log_format = '%(asctime)-15s %(levelname)s %(name)s:%(lineno)s [func=%(funcName)s] %(message)s'
    logging.basicConfig(
        level=level,
        format=log_format,
        datefmt='%Y-%m-%d %H:%M:%S %Z')


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='san11_platform main server')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='verbose mode')
    parser.add_argument('--address', default=DEFAULT_ADDRESS,
                        help='gRPC bind address')
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    init_log(args.verbose)
    serve(args.address)


if __name__ == '__main__':
    main()
