from handler.model.base.base_db import ListOptions
import handler
import os, attr
import logging
from typing import Iterable, Optional, Tuple

from .common.field_mask import FieldMask, merge_resource
from .protos import san11_platform_pb2 as pb
from .auths import Authenticator
from .model.article import Article


logger = logging.getLogger(os.path.basename(__file__))


class ArticleHandler:
    def create_article(self, parent: str, article: Article, handler_context) -> Article:
        article.author_id = handler_context.user.user_id
        article.create(parent=parent, user_id=handler_context.user.user_id)
        return article

    def get_article(self, name: str, handler_context) -> Article:
        logger.debug(f'In get_article: {name}')
        article = Article.from_name(name)
        article.view_count += 1
        article.update(update_update_time=False)
        return article

    def list_articles(self, request, handler_context) -> Tuple[Iterable[Article], str]:
        list_options = ListOptions.from_request(request)
        articles, next_page_token = Article.list(list_options)
        public_articles = []
        for article in articles:
            if article.state == pb.ResourceState.Value('NORMAL') or \
                (handler_context.user and handler_context.user.user_id == article.author_id) or \
                    (handler_context.user and handler_context.user.user_type == 'admin'):
                public_articles.append(article)
        return public_articles, next_page_token

    def update_article(self, update_article: Article, update_mask: FieldMask, handler_context) -> Article:
        article_original = Article.from_name(update_article.name)
        article: Article = merge_resource(
            article_original, update_article, update_mask)
        article.update(handler_context.user.user_id)
        return article

    def delete_article(self, article: Article, handler_context) -> Article:
        article.delete(handler_context.user.user_id)
        return article
