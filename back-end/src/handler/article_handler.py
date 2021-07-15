import os
import logging
from typing import Iterable

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
        return Article.from_name(name)
    
    def list_article(self, page_size: int, page_token: str, parent: str, handler_context) -> Iterable[Article]:
        return Article.list(parent=parent, order_by_field='create_time')
    
    def update_article(self, request: pb.UpdateArticleRequest, context) -> pb.Article:
       pass 
    
    def delete_article(self, request: pb.DeleteArticleRequest, context) -> pb.Article:
        ...