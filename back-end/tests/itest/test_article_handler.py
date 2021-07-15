
import unittest, re
from unittest.mock import Mock

from .context import setup_context
from ...src.handler.protos import san11_platform_pb2 as pb
from ...src.handler.protos.san11_platform_pb2 import CreateArticleRequest
from ...src.handler import ArticleHandler


class TestArticleHandler(unittest.TestCase):
    def setUp(self) -> None:
        self.handler = ArticleHandler()
        self.mock_context = setup_context()
        return super().setUp()
    
    def test_create_article(self):
        # GIVEN
        request = pb.CreateArticleRequest(
            parent='',
            article=pb.Article(
                subject='test-subject',
                content='test-content',
            )
        )
        # self.mock_context.
        # WHEN
        resp = self.handler.create_article(request, self.mock_context)

        # THEN
        self.assertTrue(re.match(r'articles/[0-9]+', resp.name))