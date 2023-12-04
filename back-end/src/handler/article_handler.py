import logging
import os
from typing import Iterable, List, Tuple

from handler.handler_context import HandlerContext
from handler.model.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)
from handler.model.model_article import ModelArticle
from handler.util.notifier import notify_on_creation

from .protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class ArticleHandler(HandlerBase):
    def create(self, parent: str, article: ModelArticle, handler_context: HandlerContext) -> ModelArticle:
        article.author_id = handler_context.user.user_id
        article.create(parent=parent, actor_info=handler_context.user.user_id)

        # Post creation
        notify_on_creation(article)
        return article

    def get(self, name: str, handler_context: HandlerContext) -> ModelArticle:
        article = ModelArticle.from_name(name)
        article.view_count += 1
        article.update(update_update_time=False)
        return article

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelArticle], str]:
        articles, next_page_token = ModelArticle.list(list_options)
        public_articles = []
        for article in articles:
            if article.state == pb.ResourceState.NORMAL or \
                (handler_context.user and handler_context.user.user_id == article.author_id) or \
                    (handler_context.user and handler_context.user.is_admin()):
                public_articles.append(article)
        return public_articles, next_page_token

    def update(self, update_article: ModelArticle, update_mask: FieldMask, handler_context: HandlerContext) -> ModelArticle:
        article: ModelArticle = merge_resource(
            ModelArticle.from_name(update_article.name), update_article, update_mask)
        article.update(actor_info=handler_context.user.user_id)
        return article

    def delete(self, article: ModelArticle, handler_context: HandlerContext) -> ModelArticle:
        article.delete(actor_info=handler_context.user.user_id)
        return article
