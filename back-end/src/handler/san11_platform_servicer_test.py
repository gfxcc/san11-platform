import unittest
from unittest import mock

from handler.san11_platform_servicer import San11PlatformServicer
from handler.service_dependencies import San11PlatformDependencies


class San11PlatformServicerTest(unittest.TestCase):
    def test_accepts_injected_dependencies(self):
        dependencies = San11PlatformDependencies(
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

        servicer = San11PlatformServicer(dependencies)

        self.assertIs(servicer.package_handler, dependencies.package_handler)
        self.assertIs(servicer.article_handler, dependencies.article_handler)
        self.assertIs(servicer.subscription_handler,
                      dependencies.subscription_handler)


if __name__ == '__main__':
    unittest.main()
