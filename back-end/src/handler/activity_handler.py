import logging
import os
from typing import Iterable, List, Optional, Tuple

from handler.model.base import ListOptions
from handler.model.model_activity import ModelActivity
from handler.model.model_article import ModelArticle
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_package import ModelPackage
from handler.model.model_reply import ModelReply
from handler.model.model_subscription import ModelSubscription
from handler.model.model_thread import ModelThread
from handler.model.model_user import ModelUser
from handler.model.resource import ResourceView
from handler.util.name_util import ResourceName

from .common.exception import NotFound
from .model.activity import Activity
from .protos import san11_platform_pb2 as pb
from .util.resource_parser import find_resource
from .util.time_util import get_age

logger = logging.getLogger(os.path.basename(__file__))


def _get_resource_view(name: str) -> Optional[pb.ResourceView]:
    try:
        resource = find_resource(name)
        if isinstance(resource, ModelBinary):
            package = ModelPackage.from_name(
                str(ResourceName.from_str(resource.name).parent))
            resource_view = ResourceView(
                name=package.name, display_name=package.package_name, description='', image_url=package.image_urls[0] if package.image_urls else '')
            resource_view.display_name = f'{resource_view.display_name}-{resource.version}'
        elif isinstance(resource, ModelThread):
            resource_view = ResourceView(
                name=resource.name, display_name=resource.subject, description='', image_url=None)
        elif isinstance(resource, ModelComment):
            resource_view = ResourceView(
                name=resource.name, display_name='评论', description='', image_url=None)
        elif isinstance(resource, ModelReply):
            resource_view = ResourceView(
                name=resource.name, display_name='回复', description='', image_url=None)
        elif isinstance(resource, ModelArticle):
            resource_view = ResourceView(
                name=resource.name, display_name=resource.subject, description='', image_url=None)
        elif isinstance(resource, ModelPackage):
            resource_view = ResourceView(
                name=resource.name, display_name=resource.package_name, description='', image_url=resource.image_urls[0] if resource.image_urls else '')
        elif isinstance(resource, ModelUser):
            resource_view = ResourceView(
                name=resource.name, display_name=resource.username, description='', image_url=resource.image_url)
        else:
            resource_view = None
    except Exception:
        resource_view = None
    return resource_view.to_pb() if resource_view else None


class ActivityHandler:
    def list(self, list_options: ListOptions, handler_context) -> Tuple[List[pb.Activity], str]:
        # # (TODO): BEGIN = Remove logic for model migration.
        # if not ModelActivity.list(ListOptions(parent='users/1'))[0]:
        #     for activity in Activity.list(page_size=1000, page_token=''):
        #         new_model = ModelActivity.from_v1(activity)
        #         new_model.create(parent=f'users/{activity.user_id}')
        # # END
        activities, next_page_token = ModelActivity.list(list_options)
        enriched_activities = map(lambda x:
                                  pb.Activity(
                                      name=x.name,
                                      create_time=get_age(x.create_time),
                                      action=x.action,
                                      resource_view=_get_resource_view(
                                          x.resource_name),
                                  ), activities)
        return list(enriched_activities), next_page_token
