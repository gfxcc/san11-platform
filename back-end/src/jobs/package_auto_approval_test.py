import unittest
from types import SimpleNamespace
from unittest.mock import Mock

from jobs.package_auto_approval import run_once


class AutoApprovalWorkerTest(unittest.TestCase):
    def setUp(self):
        self.settings = Mock()
        self.settings.get.return_value = SimpleNamespace(package_auto_approval_enabled=True)
        self.reviews = Mock()
        self.reviews.due.return_value = [('categories/1', 1), ('categories/1', 2)]
        self.notify = Mock()

    def run_worker(self):
        run_once(self.settings, self.reviews, self.notify)

    def test_disabled_does_not_scan_or_approve(self):
        self.settings.get.return_value.package_auto_approval_enabled = False
        self.run_worker()
        self.reviews.due.assert_not_called()
        self.notify.assert_not_called()

    def test_only_successful_transition_notifies(self):
        package = SimpleNamespace(name='categories/1/packages/1')
        self.reviews.approve.side_effect = [package, None]
        self.run_worker()
        self.notify.assert_called_once_with(package)

    def test_failure_does_not_stop_next_package(self):
        package = SimpleNamespace(name='categories/1/packages/2')
        self.reviews.approve.side_effect = [RuntimeError('temporary failure'), package]
        with self.assertLogs('jobs.package_auto_approval', level='ERROR'):
            self.run_worker()
        self.notify.assert_called_once_with(package)

    def test_notification_failure_does_not_stop_batch(self):
        self.reviews.approve.side_effect = [SimpleNamespace(name='1'), SimpleNamespace(name='2')]
        self.notify.side_effect = [RuntimeError('notification failed'), None]
        with self.assertLogs('jobs.package_auto_approval', level='ERROR'):
            self.run_worker()
        self.assertEqual(self.notify.call_count, 2)
