from __future__ import print_function

import sys
import random
import logging

import grpc

sys.path.insert(0, './src')
print(sys.path)

import san11_platform_pb2
import san11_platform_pb2_grpc



def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = san11_platform_pb2_grpc.RouteGuideStub(channel)

        print(stub.GetPackages(san11_platform_pb2.GetPackagesRequest()))

if __name__ == '__main__':
    logging.basicConfig()
    run()