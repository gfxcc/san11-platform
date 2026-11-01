"""Run with python -m jobs.package_auto_approval (one pass every 60 seconds)."""
import logging
import signal
import threading

from integrations.db.migrate import migrate
from integrations.notifications.notifier import notify_on_creation
from repositories.package_review_repository import PackageReviewRepository
from repositories.site_settings_repository import SiteSettingsRepository

logger = logging.getLogger(__name__)


def run_once(settings=None, reviews=None, notify=None):
    settings = settings or SiteSettingsRepository()
    reviews = reviews or PackageReviewRepository()
    notify = notify or notify_on_creation
    if not settings.get().package_auto_approval_enabled:
        return
    for parent, resource_id in reviews.due():
        try:
            package = reviews.approve(parent, resource_id)
            if package is not None:
                logger.info('System auto-approved %s', package.name)
                notify(package)
        except Exception:
            # One bad item or notification must not stop the rest of the batch.
            logger.exception('Auto-approval failed for %s/packages/%s', parent, resource_id)


def main():
    from app.san11_platform_server import init_log
    init_log(False)
    migrate()
    stopped = threading.Event()
    for sig in (signal.SIGTERM, signal.SIGINT):
        signal.signal(sig, lambda *_: stopped.set())
    while not stopped.is_set():
        try:
            run_once()
        except Exception:
            logger.exception('Auto-approval polling failed; retrying next minute')
        stopped.wait(60)


if __name__ == '__main__':
    main()
