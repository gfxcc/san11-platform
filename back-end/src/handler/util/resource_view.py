from typing import Union

from handler.model.model_article import ModelArticle
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_package import ModelPackage
from handler.model.model_reply import ModelReply
from handler.model.model_tag import ModelTag
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser
from handler.util.html_util import get_text_from_html
from handler.util.name_util import ResourceName, get_parent
from handler.util.resource_parser import find_resource

from ..common.visitor import visitor
from ..protos import san11_platform_pb2 as pb


class ResourceViewVisitor:
    def _visit_package(self, resource: ModelPackage) -> pb.ResourceView:
        return pb.ResourceView(
            name=resource.name,
            display_name=resource.package_name,
            description='',
            image_url=resource.image_urls[0] if resource.image_urls else '',
        )

    @visitor(ModelPackage)
    def visit(self, resource: ModelPackage) -> pb.ResourceView:
        return self._visit_package(resource)

    @visitor(ModelBinary)
    def visit(self, resource: ModelBinary) -> pb.ResourceView:
        package = ModelPackage.from_name(
            str(ResourceName.from_str(resource.name).parent))
        return pb.ResourceView(
            name=package.name,
            display_name=f'{package.package_name}-{resource.version}',
            description='',
            image_url=package.image_urls[0] if package.image_urls else '',
        )

    @visitor(ModelThread)
    def visit(self, resource: ModelThread) -> pb.ResourceView:
        image_url = None
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

    @visitor(ModelComment)
    def visit(self, resource: ModelComment) -> pb.ResourceView:
        name = ResourceName.from_str(resource.name)
        return pb.ResourceView(
            name=f'{name.parent}#comment-{resource.index}',
            display_name='评论',
            description=get_text_from_html(resource.text),
            image_url=None,
        )

    @visitor(ModelReply)
    def visit(self, resource: ModelReply) -> pb.ResourceView:
        reply_name = ResourceName.from_str(resource.name)
        comment_name = reply_name.parent
        comment: ModelComment = find_resource(comment_name)
        thread_name = reply_name.parent
        return pb.ResourceView(
            name=f'{thread_name}#comment-{comment.index}',
            display_name='回复',
            description=get_text_from_html(resource.text),
            image_url=None,
        )

    @visitor(ModelArticle)
    def visit(self, resource: ModelArticle) -> pb.ResourceView:
        return pb.ResourceView(
            name=resource.name,
            display_name=resource.subject,
            description='',
            image_url=None,
        )

    @visitor(ModelUser)
    def visit(self, resource: ModelUser) -> pb.ResourceView:
        return pb.ResourceView(
            name=resource.name,
            display_name=resource.username,
            description='',
            image_url=resource.image_url,
        )

    @visitor(ModelTag)
    def visit(self, resource: ModelTag) -> pb.ResourceView:
        return pb.ResourceView(
            name=resource.name,
            display_name=f'标签 {resource.tag_name}',
            description='',
            image_url=None,
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
        comment: ModelComment = find_resource(get_parent(resource.name))
        return f'{get_parent(resource.name)}#comment-{comment.index}'
    else:
        raise ValueError(f'Unknown resource type {type(resource)}')