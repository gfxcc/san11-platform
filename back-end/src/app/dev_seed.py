import logging
import os
from dataclasses import dataclass

from app.protos import san11_platform_pb2 as pb
from core.auth.user_util import hash_password
from core.common.env import Env, get_env
from core.time_util import get_now
from models.model_package import ModelPackage
from models.model_user import DEFAULT_USER_AVATAR, ModelUser, default_user_settings
from repositories.resource_repository import ResourceRepository, repository_for

logger = logging.getLogger(os.path.basename(__file__))

DEV_ACCOUNT_PASSWORD = 'devpass'


@dataclass(frozen=True)
class DevAccount:
    user_id: int
    username: str
    email: str
    user_type: int
    website: str


DEV_ACCOUNTS = (
    DevAccount(
        user_id=910001,
        username='dev_admin',
        email='dev-admin@san11.local',
        user_type=pb.User.ADMIN,
        website='https://san11.local/dev-admin',
    ),
    DevAccount(
        user_id=910002,
        username='dev_author',
        email='dev-author@san11.local',
        user_type=pb.User.REGULAR,
        website='https://san11.local/dev-author',
    ),
    DevAccount(
        user_id=910003,
        username='dev_user',
        email='dev-user@san11.local',
        user_type=pb.User.REGULAR,
        website='https://san11.local/dev-user',
    ),
)

DEV_AUTHOR_PACKAGE_ID = 910001
DEV_AUTHOR_PACKAGE_NAME = f'categories/1/packages/{DEV_AUTHOR_PACKAGE_ID}'

def seed_dev_data() -> None:
    if get_env() != Env.DEV:
        return

    logger.info('Seeding deterministic DEV users and author package.')
    for account in DEV_ACCOUNTS:
        _upsert_dev_account(account)
    _upsert_dev_author_package()


def _upsert_dev_account(account: DevAccount) -> None:
    repository: ResourceRepository[ModelUser] = repository_for(ModelUser)
    name = f'users/{account.user_id}'
    now = get_now()
    user = ModelUser(
        name=name,
        username=account.username,
        email=account.email,
        type=account.user_type,
        image_url=DEFAULT_USER_AVATAR,
        website=account.website,
        hashed_password=hash_password(DEV_ACCOUNT_PASSWORD),
        subscriber_count=0,
        create_time=now,
        update_time=now,
        settings=default_user_settings(),
    )

    if repository.exists(name):
        existing = repository.get(name)
        user.create_time = existing.create_time
        repository.update(user, update_update_time=False)
        logger.info('Updated DEV account %s (%s).', account.username, name)
        return

    repository._create(parent='', resource=user, resource_id=account.user_id)
    logger.info('Created DEV account %s (%s).', account.username, name)


def _upsert_dev_author_package() -> None:
    repository: ResourceRepository[ModelPackage] = repository_for(ModelPackage)
    now = get_now()
    package = ModelPackage(
        name=DEV_AUTHOR_PACKAGE_NAME,
        package_name='DEV 作者测试资源',
        description=(
            '<p>这是开发环境自动创建的作者测试资源，用来验证作者工具、'
            '截图管理、介绍编辑、版本发布和资源状态相关界面。</p>'
        ),
        create_time=now,
        update_time=now,
        state=pb.NORMAL,
        author_id=910002,
        image_urls=[],
        tags=[],
        download_count=0,
        like_count=0,
        dislike_count=0,
        subscriber_count=0,
    )

    if repository.exists(DEV_AUTHOR_PACKAGE_NAME):
        existing = repository.get(DEV_AUTHOR_PACKAGE_NAME)
        package.create_time = existing.create_time
        package.image_urls = existing.image_urls
        package.tags = existing.tags
        package.download_count = existing.download_count
        package.like_count = existing.like_count
        package.dislike_count = existing.dislike_count
        package.subscriber_count = existing.subscriber_count
        repository.update(package, update_update_time=False)
        logger.info('Updated DEV author package %s.', DEV_AUTHOR_PACKAGE_NAME)
        return

    repository._create(
        parent='categories/1',
        resource=package,
        resource_id=DEV_AUTHOR_PACKAGE_ID,
    )
    logger.info('Created DEV author package %s.', DEV_AUTHOR_PACKAGE_NAME)
