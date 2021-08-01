from handler.model.model_binary import ModelBinary
import sys, os, uuid, logging


from .protos import san11_platform_pb2
from .common.exception import Unauthenticated, PermissionDenied, InvalidArgument, AlreadyExists, NotFound
from .model.activity import Activity
from .util.resource_parser import parse_name, parse_resource_name
from .util.time_util import datetime_to_str, get_age
from .model.binary import Binary
from .model.package import Package


logger = logging.getLogger(os.path.basename(__file__))


class ActivityHandler:
    def list_activities(self, request, context):
        # TODO: Need to support list by page as the data size may grow dramatically fast.
        logger.debug(f'In list_activities')
        activities = Activity.list(page_size=0, page_token='', user_id=request.user_id)
        activities_pb= []
        for activity in activities:
            try:
                resource = parse_resource_name(activity.resource_name)
                if isinstance(resource, ModelBinary):
                    parent, _, _ = parse_name(resource.name)
                    package = Package.from_name(parent)
                    resource_view = package.view
                    resource_view.display_name = f'{resource_view.display_name}-{resource.version}'
                else:
                    resource_view = resource.view
            except NotFound as err:
                resource_view = None
            except Exception as err:
                logger.exception(f'Failed to get resource: {activity.resource_name}')
                resource_view = None
            
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
