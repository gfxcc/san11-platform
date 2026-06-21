import unittest

from .list_options import ListOptions


class FakeListRequest:
    def __init__(self, parent='', page_size=0, page_token='', order_by='', filter=''):
        self.parent = parent
        self.page_size = page_size
        self.page_token = page_token
        self.order_by = order_by
        self.filter = filter


class ListOptionsTokenTest(unittest.TestCase):
    def test_json_page_token_round_trips(self):
        token = ListOptions(
            parent='discussion',
            page_size=20,
            watermark=40,
            order_by='create_time DESC',
            filter='state=1',
        ).to_token()

        options = ListOptions.from_request(FakeListRequest(
            parent='discussion',
            page_size=20,
            page_token=token,
            order_by='create_time DESC',
            filter='state=1',
        ))

        self.assertEqual(40, options.watermark)

    def test_legacy_watermark_only_json_token_is_still_accepted(self):
        options = ListOptions.from_request(FakeListRequest(
            parent='discussion',
            page_size=20,
            page_token='{"watermark": "20"}',
        ))

        self.assertEqual(20, options.watermark)


if __name__ == '__main__':
    unittest.main()
