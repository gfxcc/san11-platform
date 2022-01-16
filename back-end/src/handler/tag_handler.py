import logging
import os

from handler.model.base.base_db import ListOptions
from handler.model.model_tag import ModelTag
from handler.model.package import Package

from .auths import Authenticator
from .model.tag import Tag
from .protos import san11_platform_pb2

logger = logging.getLogger(os.path.basename(__file__))


class TagHandler:
    def create_tag(self, parent: str, tag: ModelTag, handler_context):
        tag.create(parent=parent, user_id=handler_context.user.user_id)
        return tag

    def delete_tag(self, tag: ModelTag, handler_context):
        tag.delete(user_id=handler_context.user.user_id)
        return tag

    def list_tags(self, request, handler_context):
        # (TODO): BEGIN remove logic for model migration
        tag_id_to_name = {}
        if not ModelTag.list(ListOptions(parent='categories/1'))[0]:
            for tag in Tag.list(page_size=1000, page_token=''):
                new_model = ModelTag.from_v1(tag)
                new_model.create(parent=f'categories/{tag.category_id}')
                tag_id_to_name[tag.tag_id] = new_model.name
            # Update tag_id in Packages
            for package in Package.list(1000, ''):
                package.tag_ids = [int(tag_id_to_name[tag_id].split('/')[-1]) for tag_id in package.tag_ids]
                package.update(user_id=1)
                logger.debug(f'package is updated')
        # (TODO): END
        list_options = ListOptions.from_request(request)
        tags, next_page_token = ModelTag.list(list_options)
        return tags, next_page_token
