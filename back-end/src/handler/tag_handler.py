import logging
import os
import sys

from .auths import Authenticator, Session
from .common.exception import Unauthenticated
from .model.tag import Tag
from .protos import san11_platform_pb2

logger = logging.getLogger(os.path.basename(__file__))


class TagHandler:
    def create_tag(self, request, context):
        auth = Authenticator.from_context(context=context)
        assert auth.isAdmin()
        tag = Tag.from_pb(request.tag)
        tag.create()
        return tag.to_pb()

    def delete_tag(self, request, context):
        auth = Authenticator.from_context(context=context)
        assert auth.isAdmin()
        Tag.from_id(request.tag_id).delete()
        return san11_platform_pb2.Empty()

    def list_tags(self, request, context):
        if not request.category_id:
            return san11_platform_pb2.ListTagsResponse()
        return san11_platform_pb2.ListTagsResponse(
            tags=[tag.to_pb() for tag in Tag.list(page_size=0,
                                                  page_token='',
                                                  category_id=request.category_id)]
        )
