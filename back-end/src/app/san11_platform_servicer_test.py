import unittest
from types import SimpleNamespace
from unittest import mock

import grpc

from app.handler_context import HandlerContext
from app.protos import san11_platform_pb2 as pb
from app.san11_platform_servicer import San11PlatformServicer
from app.service_dependencies import San11PlatformDependencies


class San11PlatformServicerTest(unittest.TestCase):
    def create_dependencies(self):
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

    def test_accepts_injected_dependencies(self):
        dependencies = self.create_dependencies()
        servicer = San11PlatformServicer(dependencies)

        self.assertIs(servicer.package_handler, dependencies.package_handler)
        self.assertIs(servicer.article_handler, dependencies.article_handler)
        self.assertIs(servicer.subscription_handler,
                      dependencies.subscription_handler)

    def test_get_admin_message_requires_login(self):
        dependencies = self.create_dependencies()
        servicer = San11PlatformServicer(dependencies)
        service_context = self._service_context()

        with mock.patch.object(
                HandlerContext, 'from_service_context',
                return_value=SimpleNamespace(user=None)):
            servicer.GetAdminMessage(pb.GetAdminMessageRequest(), service_context)

        service_context.abort.assert_called_once_with(
            code=grpc.StatusCode.UNAUTHENTICATED,
            details='未验证的用户，请尝试重新登录',
        )
        dependencies.admin_handler.get_admin_message.assert_not_called()

    def test_get_admin_message_rejects_non_admin(self):
        dependencies = self.create_dependencies()
        servicer = San11PlatformServicer(dependencies)
        service_context = self._service_context()

        with mock.patch.object(
                HandlerContext, 'from_service_context',
                return_value=SimpleNamespace(user=SimpleNamespace(type=pb.User.UserType.REGULAR))):
            servicer.GetAdminMessage(pb.GetAdminMessageRequest(), service_context)

        service_context.abort.assert_called_once_with(
            code=grpc.StatusCode.PERMISSION_DENIED,
            details='需要管理员权限',
        )
        dependencies.admin_handler.get_admin_message.assert_not_called()

    def test_get_admin_message_allows_admin(self):
        dependencies = self.create_dependencies()
        dependencies.admin_handler.get_admin_message.return_value = 'admin-summary'
        servicer = San11PlatformServicer(dependencies)
        service_context = self._service_context()
        handler_context = SimpleNamespace(user=SimpleNamespace(type=pb.User.UserType.ADMIN))

        with mock.patch.object(
                HandlerContext, 'from_service_context',
                return_value=handler_context):
            response = servicer.GetAdminMessage(pb.GetAdminMessageRequest(), service_context)

        self.assertEqual(response, 'admin-summary')
        service_context.abort.assert_not_called()
        dependencies.admin_handler.get_admin_message.assert_called_once_with(
            mock.ANY,
            handler_context,
        )

    def _service_context(self):
        context = mock.Mock()
        context.invocation_metadata.return_value = []
        return context


if __name__ == '__main__':
    unittest.main()
