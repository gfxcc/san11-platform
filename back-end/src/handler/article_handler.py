import os
import logging

from .protos import san11_platform_pb2 as pb
from .auths import Authenticator
from .model.article import Article


logger = logging.getLogger(os.path.basename(__file__))


class ArticleHandler:
    def create_article(self, request: pb.CreateArticleRequest, context) -> pb.Article:
        logger.info('In create_article')
        article = Article.from_pb(request.article)
        article.create(parent=request.parent)
        return article.to_pb()
    
    def get_article(self, request: pb.GetArticleRequest, context) -> pb.Article:
        ...
    
    def list_article(self, request: pb.ListArticlesRequest, context) -> pb.ListArticlesResponse:
        ...
    
    def update_article(self, request: pb.UpdateArticleRequest, context) -> pb.Article:
        ...
    
    def delete_article(self, request: pb.DeleteArticleRequest, context) -> pb.Article:
        ...