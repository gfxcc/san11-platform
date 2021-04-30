import sys, os
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))
import logging


from lib.protos import san11_platform_pb2
from lib.auths import Authenticator, Session
from lib.exception import Unauthenticated
from lib.tag import Tag


logger = logging.getLogger(os.path.basename(__file__))


class TagHandler:
    def create_tag(self, request, context):
        logger.info(f'In CreateTag: {request.tag.name}')
        assert Authenticator.from_context(context=context).isAdmin()
        tag = Tag.from_pb(request.tag)
        tag.create()
        return tag.to_pb()
    
    def delete_tag(self, request, context):
        logger.info('In DeleteTag')
        assert Authenticator.from_context(context=context).isAdmin()
        Tag.from_id(request.tag_id).delete()
        return san11_platform_pb2.Empty()

    def list_tags(self, request, context):
        logger.info(f'In ListTags')
        return san11_platform_pb2.ListTagsResponse(
            tags=[tag.to_pb() for tag in Tag.list(page_size=0,
                                                  page_token='',
                                                  category_id=request.category_id)]
        )