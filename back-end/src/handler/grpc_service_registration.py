from __future__ import annotations

import grpc

from handler.protos import san11_platform_pb2_grpc

GeneratedSan11PlatformServicer = san11_platform_pb2_grpc.San11PlatformServicer


def register_san11_platform_servicer(servicer: GeneratedSan11PlatformServicer,
                                     server: grpc.Server) -> None:
    san11_platform_pb2_grpc.add_San11PlatformServicer_to_server(servicer, server)
