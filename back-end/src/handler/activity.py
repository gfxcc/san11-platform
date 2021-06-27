import sys, os, uuid, logging
# TODO: switch to a moduel based solution
sys.path.insert(0, os.path.abspath('..'))


from lib.protos import san11_platform_pb2
from lib.url import Url
from lib.auths import Authenticator, Session
from lib.exception import Unauthenticated, PermissionDenied, InvalidArgument, AlreadyExists, NotFound
from lib.notifier import Notifier
from lib.db.db_util import run_sql_with_param
from lib.activity import Activity
from lib.util.resource_parser import parse_resource_name
from lib.time_util import datetime_to_str


logger = logging.getLogger(os.path.basename(__file__))


class ActivityHandler:
    def list_activities(self, request, context):
        logger.debug(f'In list_activities')
        activities = Activity.list(page_size=0, page_token='', user_id=request.user_id)
        activities_pb= []
        for activity in activities:
            try:
                resource_view = parse_resource_name(activity.resource_name).view
            except NotFound as err:
                resource_view = None
            
            activities_pb.append(san11_platform_pb2.Activity(
                activity_id=activity.activity_id,
                user_id=activity.user_id,
                action=activity.action.value,
                create_time=datetime_to_str(activity.create_time),
                resource_view=resource_view.to_pb() if resource_view else None
            ))
        return san11_platform_pb2.ListActivitiesResponse(
            next_page_token='',
            activities=activities_pb
        )
