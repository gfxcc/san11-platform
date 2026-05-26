import unittest
from unittest import mock

import grpc

from handler.protos import san11_platform_pb2 as pb
from handler.protos import san11_platform_pb2_grpc
from handler.service_dependencies import San11PlatformDependencies
from san11_platform_server import create_server


class _GrpcPackage:
    def __init__(self, name: str, package_name: str):
        self.name = name
        self.package_name = package_name

    def to_pb(self):
        return pb.Package(
            name=self.name,
            package_name=self.package_name,
            description='contract test package',
            state=pb.NORMAL,
            author_id=1,
            download_count=7,
        )


def _test_dependencies() -> San11PlatformDependencies:
    return San11PlatformDependencies(
        package_handler=mock.Mock(),
        binary_handler=mock.Mock(),
        image_handler=mock.Mock(),
        comment_handler=mock.Mock(),
        reply_handler=mock.Mock(),
        user_handler=mock.Mock(),
        activity_handler=mock.Mock(),
        general_handler=mock.Mock(),
        tag_handler=mock.Mock(),
        admin_handler=mock.Mock(),
        article_handler=mock.Mock(),
        thread_handler=mock.Mock(),
        notification_handler=mock.Mock(),
        subscription_handler=mock.Mock(),
    )


class San11PlatformGrpcContractTest(unittest.TestCase):
    def setUp(self):
        self.dependencies = _test_dependencies()
        self.dependencies.package_handler.list.return_value = (
            [
                _GrpcPackage('categories/1/packages/101', 'contract-package-a'),
                _GrpcPackage('categories/1/packages/102', 'contract-package-b'),
            ],
            'next-page-token',
        )
        self.server = create_server(self.dependencies, max_workers=1)
        self.port = self.server.add_insecure_port('127.0.0.1:0')
        self.server.start()
        self.channel = grpc.insecure_channel(f'127.0.0.1:{self.port}')
        self.stub = san11_platform_pb2_grpc.San11PlatformStub(self.channel)

    def tearDown(self):
        self.channel.close()
        self.server.stop(0)

    def test_list_packages_over_real_grpc_server(self):
        response = self.stub.ListPackages(
            pb.ListPackagesRequest(parent='categories/1', page_size=10),
            metadata=(('client', 'backend-contract-test'),),
            timeout=5,
        )

        self.assertEqual(
            [package.name for package in response.packages],
            ['categories/1/packages/101', 'categories/1/packages/102'],
        )
        self.assertEqual(
            [package.package_name for package in response.packages],
            ['contract-package-a', 'contract-package-b'],
        )
        self.assertEqual(response.next_page_token, 'next-page-token')

        list_options = self.dependencies.package_handler.list.call_args.kwargs[
            'list_options']
        handler_context = self.dependencies.package_handler.list.call_args.kwargs[
            'handler_context']
        self.assertEqual(list_options.parent, 'categories/1')
        self.assertEqual(list_options.page_size, 10)
        self.assertEqual(handler_context.client, 'backend-contract-test')


if __name__ == '__main__':
    unittest.main()
