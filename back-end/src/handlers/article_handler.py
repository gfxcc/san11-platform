import logging
import os
from typing import Iterable, List, Tuple

from app.handler_context import HandlerContext
from core.models.base import (FieldMask, HandlerBase, ListOptions,
                                merge_resource)
from models.model_article import ModelArticle
from repositories.resource_repository import repository_for
from integrations.notifications.notifier import notify_on_creation

from app.protos import san11_platform_pb2 as pb

logger = logging.getLogger(os.path.basename(__file__))


class ArticleHandler(HandlerBase):
    def __init__(self, article_repository=None):
        self.article_repository = article_repository or repository_for(ModelArticle)

    def create(self, parent: str, article: ModelArticle, handler_context: HandlerContext) -> ModelArticle:
        article.author_id = handler_context.user.user_id
        self.article_repository.create(
            parent=parent, resource=article, actor_info=handler_context.user.user_id)

        # Post creation
        notify_on_creation(article)
        return article

    def get(self, name: str, handler_context: HandlerContext) -> ModelArticle:
        article = self.article_repository.get(name)
        article.view_count += 1
        self.article_repository.update(article, update_update_time=False)
        return article

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelArticle], str]:
        articles, next_page_token = self.article_repository.list(list_options)
        public_articles = []
        for article in articles:
            if article.state == pb.ResourceState.NORMAL or \
                (handler_context.user and handler_context.user.user_id == article.author_id) or \
                    (handler_context.user and handler_context.user.is_admin()):
                public_articles.append(article)
        return public_articles, next_page_token

    def update(self, update_article: ModelArticle, update_mask: FieldMask, handler_context: HandlerContext) -> ModelArticle:
        article: ModelArticle = merge_resource(
            self.article_repository.get(update_article.name), update_article, update_mask)
        return self.article_repository.update(
            article, actor_info=handler_context.user.user_id)

    def delete(self, article: ModelArticle, handler_context: HandlerContext) -> ModelArticle:
        return self.article_repository.delete(
            article, actor_info=handler_context.user.user_id)

    def delete_by_name(self, name: str, handler_context: HandlerContext) -> ModelArticle:
        return self.delete(self.article_repository.get(name), handler_context)
