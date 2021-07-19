import os
import logging
from typing import Iterable

from .common.field_mask import FieldMask, merge_resource
from .protos import san11_platform_pb2 as pb
from .auths import Authenticator
from .model.article import Article


logger = logging.getLogger(os.path.basename(__file__))


class ArticleHandler:
    def create_article(self, parent: str, article: Article, handler_context) -> Article:
        article.author_id = handler_context.user.user_id
        article.create(parent=parent)
        return article

    def get_article(self, name: str, handler_context) -> Article:
        logger.debug(f'In get_article: {name}')
        article = Article.from_name(name)
        article.view_count += 1
        article.update(update_update_time=False)
        return article

    def list_articles(self, page_size: int, page_token: str, parent: str, handler_context) -> Iterable[Article]:
        articles = Article.list(parent=parent, order_by_field='create_time')
        public_articles = []
        for article in articles:
            if article.state == pb.ResourceState.Value('NORMAL') or \
                (handler_context.user and handler_context.user.user_id == article.author_id) or \
                    (handler_context.user and handler_context.user.user_type == 'admin'):
                public_articles.append(article)
        return public_articles

    def update_article(self, update_article: Article, update_mask: FieldMask, handler_context) -> Article:
        article_original = Article.from_name(update_article.name)
        article: Article = merge_resource(
            article_original, update_article, update_mask)
        article.update()
        return article

    def delete_article(self, name: str, handler_context) -> Article:
        article = Article.from_name(name)
        article.delete()
        return article
