import logging
import os
from typing import Iterable, Tuple

from handler.model.base import FieldMask, merge_resource
from handler.model.base.base_db import ListOptions
from handler.model.model_article import ModelArticle

from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class ArticleHandler:
    def create_article(self, parent: str, article: ModelArticle, handler_context) -> ModelArticle:
        article.author_id = handler_context.user.user_id
        article.create(parent=parent, user_id=handler_context.user.user_id)
        return article

    def get_article(self, name: str, handler_context) -> ModelArticle:
        article = ModelArticle.from_name(name)
        article.view_count += 1
        article.update(update_update_time=False)
        return article

    def list_articles(self, request, handler_context) -> Tuple[Iterable[ModelArticle], str]:
        list_options = ListOptions.from_request(request)
        articles, next_page_token = ModelArticle.list(list_options)
        public_articles = []
        for article in articles:
            if article.state == pb.ResourceState.Value('NORMAL') or \
                (handler_context.user and handler_context.user.user_id == article.author_id) or \
                    (handler_context.user and handler_context.user.user_type == 'admin'):
                public_articles.append(article)
        return public_articles, next_page_token

    def update_article(self, base_article: ModelArticle, update_article: ModelArticle, update_mask: FieldMask, handler_context) -> ModelArticle:
        article: ModelArticle = merge_resource(
            base_article, update_article, update_mask)
        article.update(handler_context.user.user_id)
        return article

    def delete_article(self, article: ModelArticle, handler_context) -> ModelArticle:
        article.delete(handler_context.user.user_id)
        return article
