from typing import Union

from models.model_article import ModelArticle
from models.model_binary import ModelBinary
from models.model_comment import ModelComment
from models.model_package import ModelPackage
from models.model_reply import ModelReply
from models.model_tag import ModelTag
from models.model_thread import ModelThread
from models.model_user import ModelUser
from repositories.resource_repository import repository_for
from core.html_util import get_text_from_html
from core.resources.name_util import ResourceName, get_parent
from core.resources.resource_parser import find_resource

from app.protos import san11_platform_pb2 as pb

ViewableResource = Union[
    ModelArticle,
    ModelBinary,
    ModelComment,
    ModelPackage,
    ModelReply,
    ModelTag,
    ModelThread,
    ModelUser,
]


class ResourceViewVisitor:
    def visit(self, resource: ViewableResource) -> pb.ResourceView:
        if isinstance(resource, ModelPackage):
            return self._visit_package(resource)
        if isinstance(resource, ModelBinary):
            return self._visit_binary(resource)
        if isinstance(resource, ModelThread):
            return self._visit_thread(resource)
        if isinstance(resource, ModelComment):
            return self._visit_comment(resource)
        if isinstance(resource, ModelReply):
            return self._visit_reply(resource)
        if isinstance(resource, ModelArticle):
            return self._visit_article(resource)
        if isinstance(resource, ModelUser):
            return self._visit_user(resource)
        if isinstance(resource, ModelTag):
            return self._visit_tag(resource)
        raise TypeError(f'Cannot create resource view for {type(resource)}')

    def _visit_package(self, resource: ModelPackage) -> pb.ResourceView:
        return pb.ResourceView(
            name=resource.name,
            display_name=resource.package_name,
            description='',
            image_url=resource.image_urls[0] if resource.image_urls else '',
        )

    def _visit_binary(self, resource: ModelBinary) -> pb.ResourceView:
        package = repository_for(ModelPackage).get(
            str(ResourceName.from_str(resource.name).parent))
        return pb.ResourceView(
            name=package.name,
            display_name=f'{package.package_name}-{resource.version}',
            description='',
            image_url=package.image_urls[0] if package.image_urls else '',
        )

    def _visit_thread(self, resource: ModelThread) -> pb.ResourceView:
        image_url = ''
        try:
            parent_obj = find_resource(
                ResourceName.from_str(resource.name).parent)
            if isinstance(parent_obj, ModelPackage):
                image_url = self._visit_package(parent_obj).image_url
        except:
            ...
        return pb.ResourceView(
            name=resource.name,
            display_name=resource.subject,
            description=get_text_from_html(resource.content),
            image_url=image_url,
        )

    def _visit_comment(self, resource: ModelComment) -> pb.ResourceView:
        name = ResourceName.from_str(resource.name)
        return pb.ResourceView(
            name=f'{name.parent}#comment-{resource.index}',
            display_name='评论',
            description=get_text_from_html(resource.text),
            image_url='',
        )

    def _visit_reply(self, resource: ModelReply) -> pb.ResourceView:
        reply_name = ResourceName.from_str(resource.name)
        comment_name = reply_name.parent
        comment = find_resource(comment_name)
        if not isinstance(comment, ModelComment):
            raise TypeError(f'{comment_name} is not a comment')
        thread_name = reply_name.parent
        return pb.ResourceView(
            name=f'{thread_name}#comment-{comment.index}',
            display_name='回复',
            description=get_text_from_html(resource.text),
            image_url='',
        )

    def _visit_article(self, resource: ModelArticle) -> pb.ResourceView:
        return pb.ResourceView(
            name=resource.name,
            display_name=resource.subject,
            description='',
            image_url='',
        )

    def _visit_user(self, resource: ModelUser) -> pb.ResourceView:
        return pb.ResourceView(
            name=resource.name,
            display_name=resource.username,
            description='',
            image_url=resource.image_url,
        )

    def _visit_tag(self, resource: ModelTag) -> pb.ResourceView:
        return pb.ResourceView(
            name=resource.name,
            display_name=f'标签 {resource.tag_name}',
            description='',
            image_url='',
        )


def get_resource_url(resource) -> str:
    # Return relative url of a resource
    if isinstance(resource, (ModelPackage, ModelThread, ModelUser, ModelArticle)):
        return resource.name
    elif isinstance(resource, ModelBinary):
        return get_parent(resource.name)
    elif isinstance(resource, ModelComment):
        return f'{get_parent(resource.name)}#comment-{resource.index}'
    elif isinstance(resource, ModelReply):
        comment = find_resource(get_parent(resource.name))
        if not isinstance(comment, ModelComment):
            raise TypeError(f'Parent of {resource.name} is not a comment')
        return f'{get_parent(resource.name)}#comment-{comment.index}'
    else:
        raise ValueError(f'Unknown resource type {type(resource)}')
