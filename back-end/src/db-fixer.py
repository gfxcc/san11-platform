import re
from typing import Optional

from handler.model.base import ListOptions
from handler.model.model_activity import ModelActivity
from handler.model.model_binary import ModelBinary
from handler.model.model_user import (ModelUser, NotificationSettings,
                                      UserSettings)
from handler.util.time_util import get_now


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
    users = ModelUser.list(ListOptions(parent=None))[0]
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


def main():
    backfill_user_settings()


if __name__ == "__main__":
    main()
