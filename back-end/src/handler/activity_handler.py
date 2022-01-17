import logging
import os

from handler.model.model_article import ModelArticle
from handler.model.model_binary import ModelBinary
from handler.model.model_comment import ModelComment
from handler.model.model_package import ModelPackage
from handler.model.model_reply import ModelReply
from handler.model.model_thread import ModelThread
from handler.model.resource import ResourceView
from handler.util.name_util import ResourceName

from .common.exception import NotFound
from .model.activity import Activity
from .model.package import Package
from .protos import san11_platform_pb2
from .util.resource_parser import find_resource
from .util.time_util import get_age

logger = logging.getLogger(os.path.basename(__file__))


class ActivityHandler:
    def list_activities(self, request, context):
        # TODO: Need to support list by page as the data size may grow dramatically fast.
        logger.debug(f'In list_activities')
        activities = Activity.list(
            page_size=0, page_token='', user_id=request.user_id)
        activities_pb = []
        for activity in activities:
            try:
                resource = find_resource(activity.resource_name)
                if isinstance(resource, ModelBinary):
                    package = Package.from_name(str(ResourceName.from_str(resource.name).parent))
                    resource_view = package.view
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
                else:
                    resource_view = resource.view
            except NotFound as err:
                ...
            except Exception as err:
                logger.exception(
                    f'Failed to get resource: {activity.resource_name}')
            else:
                activities_pb.append(san11_platform_pb2.Activity(
                    activity_id=activity.activity_id,
                    user_id=activity.user_id,
                    action=activity.action.value,
                    create_time=get_age(activity.create_time),
                    resource_view=resource_view.to_pb() if resource_view else None
                ))
        return san11_platform_pb2.ListActivitiesResponse(
            next_page_token='',
            activities=activities_pb
        )
