
import unittest
import re
from unittest.mock import Mock, patch

from .context import setup_handler_context
from ...src.handler.protos import san11_platform_pb2 as pb
from ...src.handler.protos.san11_platform_pb2 import CreateArticleRequest
from ...src.handler import ArticleHandler
from ...src.handler.model import Article


class TestArticleHandler(unittest.TestCase):
    def setUp(self) -> None:
        self.handler = ArticleHandler()
        self.mock_handler_context = setup_handler_context()
        return super().setUp()

    def test_create_article(self):
        # GIVEN
        request = pb.CreateArticleRequest(
            parent='test-parent',
            article=pb.Article(
                subject='test-subject',
                content='test-content',
                tags=['new', 'war', 'design'],
            ),
        )
        # self.mock_context.
        # WHEN
        parent, article = request.parent, Article.from_pb(request.article)
        created_article = self.handler.create_article(
            parent=parent, article=article, handler_context=self.mock_handler_context)

        # THEN
        print(created_article)
        self.assertRegex(created_article.name, r'articles/[0-9]+')

    def test_get_article(self):
        # GIVEN
        request = pb.GetArticleRequest(
            name='test-parent/articles/1'
        )
        # WHEN
        article = self.handler.get_article(request.name, self.mock_handler_context)
        # THEN
        self.assertEqual(article.name, request.name)

    def test_list_article(self):
        # GIVEN
        request = pb.ListArticlesRequest(
            parent='test-parent'
        )
        # WHEN
        articles = self.handler.list_article(100, '', request.parent, self.mock_handler_context)
        # THEN
        for article in articles:
            self.assertRegex(article.name, r'articles/[0-9]+')
