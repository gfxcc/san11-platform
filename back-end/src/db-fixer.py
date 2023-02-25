import argparse
import re
from typing import List, Optional

from handler.image_handler import resample_img_for_user_avatar
from handler.model.base import ListOptions
from handler.model.model_binary import ModelBinary
from handler.model.model_legacy_subscription import ModelLegacySubscription
from handler.model.model_user import (DEFAULT_USER_AVATAR, ModelUser,
                                      NotificationSettings, UserSettings)
from handler.model.plugins.subscribable import ModelSubscription
from handler.model.plugins.tracklifecycle import ModelActivity
from handler.util.file_server import (BucketClass, FileServerType,
                                      get_file_server)
from handler.util.name_util import ResourceName
from handler.util.resource_parser import parse_resource_name
from handler.util.time_util import get_now

MAX_RESOURCE_COUNT = 100000000000


def _get_earlist_activity(user: ModelUser) -> Optional[ModelActivity]:
    activities = ModelActivity.list(ListOptions(
        parent=user.name, order_by='create_time'))[0]
    return next(activities, None)


def backfill_user_create_update_time():
    '''
    Traverse table `users` and set fields `create_time`, `update_time` to the
    `create_time` of earlist activity created by given user or current time if 
    no activity is found.
    '''
    users = ModelUser.list(ListOptions(parent=None))[0]
    for i, user in enumerate(users):
        activity = _get_earlist_activity(user)
        user.create_time = activity.create_time if activity else get_now()
        user.update_time = user.create_time
        user.update(update_update_time=False)
        print(
            f'Progress idx-{i}: set {user.username}\'s create_time to {user.create_time}')


def backfill_user_settings():
    '''
    Traverse table `users` and set fields `settings`
    '''
    users = ModelUser.list(ListOptions(
        parent=None, page_size=MAX_RESOURCE_COUNT))[0]
    for i, user in enumerate(users):
        user.settings = UserSettings(notification=NotificationSettings(
            send_emails=True, subscriptions=True, recommendations=True, mentions=True, threads=True, comments=True, replies=True))
        user.update(update_update_time=False)
        print(
            f'Progress idx-{i}: set {user.username}\'s settings to {user.settings}')


def backfill_binaries_file_server():
    binaries = ModelBinary.list(ListOptions(parent=None))[0]
    for i, binary in enumerate(binaries):
        if binary.file:
            binary.file.server = 2
        binary.update(update_update_time=False)
        print(
            f'Progress idx-{i}: updated {binary}')


def backfill_binary_file_ext():
    binaries = ModelBinary.list(ListOptions(parent=None))[0]
    for i, binary in enumerate(binaries):
        file = binary.file
        if not file:
            continue
        if file.ext:
            continue
        if new_ext := re.search(r'.[^.]+$', file.uri):
            print(f'Assigning {new_ext} to {file}')
            file.ext = new_ext
        # binary.update(update_update_time=False)


def backfill_subscriptions():
    legacy_subs: List[ModelLegacySubscription] = ModelLegacySubscription.list(
        ListOptions(parent=None))[0]
    for i, legacy_sub in enumerate(legacy_subs):
        target = str(ResourceName.from_str(legacy_sub.name).parent)
        sub = ModelSubscription(name='',
                                target=target, create_time=get_now(), update_time=get_now())
        sub.create(parent=f'users/{legacy_sub.subscriber_id}')
        print(
            f'Progress {i}/{len(legacy_subs)}')


def migrate_user_image_url_default_value():
    for i, user in enumerate(ModelUser.list(ListOptions(parent=None, page_size=MAX_RESOURCE_COUNT))[0]):
        if user.image_url:
            if user.image_url != 'users/default_avatar.jpg':
                continue
            user.image_url = DEFAULT_USER_AVATAR
            user.update(update_update_time=False)
            print(f'Progress {i}: updated {user}')


def migrate_user_image_url():
    file_server = get_file_server(FileServerType.GCS)
    for i, user in enumerate(ModelUser.list(ListOptions(parent=None, page_size=MAX_RESOURCE_COUNT))[0]):
        if user.image_url:
            if user.image_url == DEFAULT_USER_AVATAR:
                continue
            resample_img_for_user_avatar(file_server, user.image_url)
            print(f'Progress {i}: updated {user}')


def parse_args():
    parser = argparse.ArgumentParser(description='Db-fixer')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='verbose mode')
    parser.add_argument('--backfill-user-create-update-time',
                        action='store_true', help='backfill user create/update time')
    parser.add_argument('--backfill-user-settings',
                        action='store_true', help='backfill user settings')
    parser.add_argument('--backfill-binaries-file-server',
                        action='store_true', help='backfill binaries file server')
    parser.add_argument('--backfill-binary-file-ext',
                        action='store_true', help='backfill binary file ext')
    parser.add_argument('--backfill-subscriptions',
                        action='store_true', help='backfill subscriptions')
    parser.add_argument('--migrate-user-image-url-default-value',
                        action='store_true', help='migrate user image url default value')
    parser.add_argument('--migrate-user-image-url',
                        action='store_true', help='migrate user image url')
    args = parser.parse_args()
    return args


def main():
    args = parse_args()
    if args.backfill_user_create_update_time:
        backfill_user_create_update_time()
    elif args.backfill_user_settings:
        backfill_user_settings()
    elif args.backfill_binaries_file_server:
        backfill_binaries_file_server()
    elif args.backfill_binary_file_ext:
        backfill_binary_file_ext()
    elif args.backfill_subscriptions:
        backfill_subscriptions()
    elif args.migrate_user_image_url_default_value:
        migrate_user_image_url_default_value()
    elif args.migrate_user_image_url:
        migrate_user_image_url()


if __name__ == "__main__":
    main()
