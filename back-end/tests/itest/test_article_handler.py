
# import unittest
# import json
# import re
# from unittest.mock import Mock, patch

# from .context import setup_handler_context, parse_name
# from ...src.handler.common.exception import NotFound
# from ...src.handler.protos import san11_platform_pb2 as pb
# from ...src.handler.protos.san11_platform_pb2 import CreateArticleRequest
# from ...src.handler import ArticleHandler
# from ...src.handler.model import Article
# from ...src.handler.db.db_util import run_sql_with_param


# def create_article(**kwargs):
#     ARTICLE_DICT = {
#         'name': 'test-parent/articles/99999',
#         'subject': 'sample-subject',
#         'content': 'sample-content',
#         'author_id': 12345,
#         'state': 1,
#         'tags': '[new, war, design]',
#         'view_count': 19,
#         'like_count': 9,
#         'create_time': '2021-07-16 23:15:06.451775',
#         'update_time': '2021-07-16 23:15:06.451794'
#     }
#     for k, v in kwargs.items():
#         ARTICLE_DICT[k] = v
#     parent, resource_id = parse_name(ARTICLE_DICT['name'])
#     sql = f'INSERT INTO articles (parent, resource_id, data) VALUES (%(parent)s, %(resource_id)s, %(data)s)'
#     run_sql_with_param(sql, {
#         'parent': parent,
#         'resource_id': resource_id,
#         'data': json.dumps(ARTICLE_DICT, default=str),
#     })


# def purge_articles():
#     '''Purge table articles'''
#     sql = 'DELETE FROM articles'
#     run_sql_with_param(sql, {})


# class TestArticleHandler(unittest.TestCase):
#     def setUp(self) -> None:
#         self.handler = ArticleHandler()
#         self.mock_handler_context = setup_handler_context()
#         return super().setUp()

#     def tearDown(self) -> None:
#         purge_articles()

#     def test_create_article(self):
#         # GIVEN
#         request = pb.CreateArticleRequest(
#             parent='test-parent',
#             article=pb.Article(
#                 subject='test-subject',
#                 content='test-content',
#                 tags=['new', 'war', 'design'],
#             ),
#         )
#         # self.mock_context.
#         # WHEN
#         parent, article = request.parent, Article.from_pb(request.article)
#         created_article = self.handler.create_article(
#             parent=parent, article=article, handler_context=self.mock_handler_context)

#         # THEN
#         print(created_article)
#         self.assertRegex(created_article.name, r'articles/[0-9]+')

#     def test_get_article(self):
#         # GIVEN
#         name, subject, content, state = 'articles/999', 'sample-subject', 'sample-content', 2
#         create_article(name=name, subject=subject,
#                        content=content, state=state)
#         # WHEN
#         article = self.handler.get_article(
#             name, self.mock_handler_context)
#         # THEN
#         self.assertEqual(article.name, name)
#         self.assertEqual(article.subject, subject)
#         self.assertEqual(article.content, content)
#         self.assertEqual(article.state, state)

#     def test_list_article(self):
#         # GIVEN
#         name, subject, content, state = 'articles/10', 'sample-subject', 'sample-content', 2
#         create_article(name=name, subject=subject,
#                        content=content, state=state)
#         name2 = 'articles/11'
#         create_article(name=name2, subject=subject,
#                        content=content, state=state)
#         request = pb.ListArticlesRequest(
#             parent=''
#         )
#         # WHEN
#         articles = self.handler.list_articles(
#             100, '', request.parent, self.mock_handler_context)
#         # THEN
#         self.assertSetEqual(set(article.name for article in articles), {name, name2})

#     def test_update_article(self):
#         # GIVEN
#         name, subject, content, state = 'test-parent/articles/999', 'sample-subject', 'sample-content', 2
#         create_article(name=name, subject=subject,
#                        content=content, state=state)
#         new_content = 'new-content'
#         request = pb.UpdateArticleRequest(
#             article=pb.Article(
#                 name=name,
#                 content=new_content,
#             ),
#             update_mask=pb.FieldMask(
#                 paths=['content']
#             )
#         )
#         # WHEN
#         article = self.handler.update_article(Article.from_pb(
#             request.article), request.update_mask, self.mock_handler_context)
#         # THEN
#         self.assertRegex(article.name, r'articles/[0-9]+')
#         self.assertRegex(article.content, new_content)

#     def test_delete_article(self):
#         name = 'articles/999'
#         create_article(name=name)
#         # GIVEN
#         request = pb.DeleteArticleRequest(
#             name=name
#         )
#         # WHEN
#         article = self.handler.delete_article(
#             Article.from_name(request.name), self.mock_handler_context)
#         # THEN
#         self.assertRaises(NotFound, self.handler.get_article,
#                           request.name, self.mock_handler_context)
