import logging
import os
from typing import List, Tuple

from core.errors.exceptions import FailedPrecondition
from app.handler_context import HandlerContext
from core.models.base import HandlerBase
from core.models.base import ListOptions
from models.model_package import ModelPackage
from models.model_tag import ModelTag
from repositories.resource_repository import repository_for

logger = logging.getLogger(os.path.basename(__file__))


class TagHandler(HandlerBase):
    def __init__(self, tag_repository=None, package_repository=None):
        self.tag_repository = tag_repository or repository_for(ModelTag)
        self.package_repository = package_repository or repository_for(ModelPackage)

    def create(self, parent: str, tag: ModelTag, handler_context: HandlerContext) -> ModelTag:
        return self.tag_repository.create(
            parent=parent, resource=tag, actor_info=handler_context.authenticated_user.user_id)

    def list(self, list_options: ListOptions, handler_context: HandlerContext) -> Tuple[List[ModelTag], str]:
        tags, next_page_token = self.tag_repository.list(list_options)
        return tags, next_page_token

    def delete(self, name: str, handler_context: HandlerContext) -> ModelTag:
        tag: ModelTag = self.tag_repository.get(name)
        taged_packages = self.package_repository.list(ListOptions(
            parent='categories/1', filter=f'tags=\"{tag.name}\"'))[0]
        taged_packages += self.package_repository.list(ListOptions(
            parent='categories/2', filter=f'tags=\"{tag.name}\"'))[0]
        taged_packages += self.package_repository.list(ListOptions(
            parent='categories/3', filter=f'tags=\"{tag.name}\"'))[0]
        if taged_packages:
            raise FailedPrecondition(message='标签仍在使用')
        return self.tag_repository.delete(
            tag, actor_info=handler_context.authenticated_user.user_id)
