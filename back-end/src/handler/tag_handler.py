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
    def _create(self, parent: str, tag: ModelTag, handler_context: HandlerContext) -> ModelTag:
        tag.create(parent=parent, actor_info=handler_context.user.user_id)
        return tag

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelTag], str]:
        tags, next_page_token = ModelTag.list(list_options)
        return tags, next_page_token

    def delete(self, name: str, handler_context: HandlerContext) -> ModelTag:
        tag: ModelTag = ModelTag.from_name(name)
        taged_packages = ModelPackage.list(ListOptions(
            parent='categories/1', filter=f'tags=\"{tag.name}\"'))[0]
        taged_packages += ModelPackage.list(ListOptions(
            parent='categories/2', filter=f'tags=\"{tag.name}\"'))[0]
        taged_packages += ModelPackage.list(ListOptions(
            parent='categories/3', filter=f'tags=\"{tag.name}\"'))[0]
        if taged_packages:
            raise FailedPrecondition(message='标签仍在使用')
        tag.delete(actor_info=handler_context.user.user_id)
        return tag
