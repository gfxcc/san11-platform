import logging
import os
from typing import List, Tuple

from handler.common.exception import FailedPrecondition
from handler.handler_context import HandlerContext
from handler.model.base import HandlerBase
from handler.model.base.base_db import ListOptions
from handler.model.model_package import ModelPackage
from handler.model.model_tag import ModelTag

logger = logging.getLogger(os.path.basename(__file__))


class TagHandler(HandlerBase):
    def create(self, parent: str, tag: ModelTag, handler_context: HandlerContext) -> ModelTag:
        tag.create(parent=parent, user_id=handler_context.user.user_id)
        return tag

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelTag], str]:
        # (TODO): BEGIN remove logic for model migration
        # tag_id_to_name = {}
        # if not ModelTag.list(ListOptions(parent='categories/1'))[0]:
        #     for tag in Tag.list(page_size=1000, page_token=''):
        #         new_model = ModelTag.from_v1(tag)
        #         new_model.create(parent=f'categories/{tag.category_id}')
        #         tag_id_to_name[tag.tag_id] = new_model.name
        #     # Update tag_id in Packages
        #     for package in Package.list(1000, ''):
        #         package.tag_ids = [int(tag_id_to_name[tag_id].split('/')[-1]) for tag_id in package.tag_ids]
        #         package.update(user_id=1)
        #         logger.debug(f'package is updated')
        # (TODO): END
        tags, next_page_token = ModelTag.list(list_options)
        return tags, next_page_token

    def delete(self, name: str, handler_context) -> ModelTag:
        tag = ModelTag.from_name(name)
        taged_packages = ModelPackage.list(ListOptions(parent='categories/1', filter=f'tags=\"{tag.name}\"'))[0]
        taged_packages += ModelPackage.list(ListOptions(parent='categories/2', filter=f'tags=\"{tag.name}\"'))[0]
        taged_packages += ModelPackage.list(ListOptions(parent='categories/3', filter=f'tags=\"{tag.name}\"'))[0]
        if taged_packages:
            raise FailedPrecondition(message='标签仍在使用')
        tag.delete(user_id=handler_context.user.user_id)
        return tag
