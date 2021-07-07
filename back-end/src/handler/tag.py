import sys, os
import logging


from .protos import san11_platform_pb2
from .auths import Authenticator, Session
from .common.exception import Unauthenticated
from .model.tag import Tag


logger = logging.getLogger(os.path.basename(__file__))


class TagHandler:
    def create_tag(self, request, context):
        logger.info(f'In CreateTag: {request.tag.name}')
        auth = Authenticator.from_context(context=context)
        assert auth.isAdmin()
        tag = Tag.from_pb(request.tag)
        tag.create(user_id=auth.session.user.user_id)
        return tag.to_pb()
    
    def delete_tag(self, request, context):
        logger.info('In DeleteTag')
        auth = Authenticator.from_context(context=context)
        assert auth.isAdmin()
        Tag.from_id(request.tag_id).delete(user_id=auth.session.user.user_id)
        return san11_platform_pb2.Empty()

    def list_tags(self, request, context):
        logger.info(f'In ListTags: category_id: {request.category_id}')
        return san11_platform_pb2.ListTagsResponse(
            tags=[tag.to_pb() for tag in Tag.list(page_size=0,
                                                  page_token='',
                                                  category_id=request.category_id)]
        )