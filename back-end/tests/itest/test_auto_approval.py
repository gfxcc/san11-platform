"""Exercise the real PostgreSQL triggers, transactions, settings, and worker.

CI supplies TEST_DATABASE_URL. Each test uses its own temporary schema.
"""
import json
import os
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest.mock import Mock

import psycopg2
from psycopg2.pool import ThreadedConnectionPool
import pytest

from app.protos import san11_platform_pb2 as pb
from integrations.db import db_util
from integrations.db.migrate import migrate
from jobs.package_auto_approval import run_once
from repositories.package_review_repository import PackageReviewRepository
from repositories.site_settings_repository import SiteSettingsRepository
from repositories.postgres_resource_storage import PostgresResourceStorage

URL = os.environ.get('TEST_DATABASE_URL')
pytestmark = pytest.mark.skipif(not URL, reason='TEST_DATABASE_URL is required for PostgreSQL integration tests')


@pytest.fixture
def db(monkeypatch):
    schema = 'review_test_' + uuid.uuid4().hex
    admin = psycopg2.connect(URL)
    admin.autocommit = True
    with admin.cursor() as cursor:
        cursor.execute(f'CREATE SCHEMA {schema}')
    pool = ThreadedConnectionPool(1, 8, URL, options=f'-c search_path={schema} -c lock_timeout=5000')
    monkeypatch.setattr(db_util, '_pgpool', pool)
    with db_util.connection() as conn, conn.cursor() as cursor:
        cursor.execute('''CREATE TABLE packages(parent text, resource_id serial, data json,
                            PRIMARY KEY(parent, resource_id));
                          CREATE TABLE binaries(parent text, resource_id serial, data json,
                            PRIMARY KEY(parent, resource_id));''')
        # Existing resources must not be backfilled when the feature is installed.
        cursor.execute('''INSERT INTO packages(parent, resource_id, data)
                          VALUES ('categories/1', 99, '{"state":2}');
                          INSERT INTO binaries(parent, data) VALUES ('categories/1/packages/99', '{}');''')
    migrate()
    migrate()  # Both API and worker startup can safely call this.
    try:
        yield
    finally:
        pool.closeall()
        with admin.cursor() as cursor:
            cursor.execute(f'DROP SCHEMA {schema} CASCADE')
        admin.close()


def sql(query, params=()):
    with db_util.connection() as conn, conn.cursor() as cursor:
        cursor.execute(query, params)
        return cursor.fetchall() if cursor.description else []


def package(state=pb.UNDER_REVIEW):
    data = {'name': 'categories/1/packages/1', 'state': state, 'package_name': 'Test',
            'author_id': 1, 'create_time': '2026-01-01T00:00:00+00:00',
            'update_time': '2026-01-01T00:00:00+00:00', 'tags': [], 'image_urls': []}
    sql('INSERT INTO packages(parent, resource_id, data) VALUES (%s, 1, %s)',
        ('categories/1', json.dumps(data)))


def version():
    return sql("INSERT INTO binaries(parent, data) VALUES ('categories/1/packages/1', '{}') RETURNING resource_id")[0][0]


def enable(value=True):
    return SiteSettingsRepository().update(pb.SiteSettings(package_auto_approval_enabled=value), 1)


def due():
    sql("UPDATE package_review_schedule SET approve_at = clock_timestamp() - interval '1 second'")


def approve():
    return PackageReviewRepository().approve('categories/1', 1)


def test_default_off_and_no_historical_backfill(db):
    assert not SiteSettingsRepository().get().package_auto_approval_enabled
    assert sql('SELECT * FROM package_review_schedule') == []


def test_first_successful_version_sets_24_hours_without_reset(db):
    package()
    assert sql('SELECT * FROM package_review_schedule') == []
    version()
    first = sql('SELECT approve_at FROM package_review_schedule')[0][0]
    remaining = sql('SELECT EXTRACT(EPOCH FROM (approve_at - clock_timestamp())) FROM package_review_schedule')[0][0]
    assert 86390 < remaining <= 86400
    version()
    assert sql('SELECT approve_at FROM package_review_schedule')[0][0] == first
    assert approve() is None


def test_failed_insert_rolls_back_timer(db):
    package()
    with pytest.raises(RuntimeError):
        with db_util.connection() as conn, conn.cursor() as cursor:
            cursor.execute("INSERT INTO binaries(parent, data) VALUES ('categories/1/packages/1', '{}')")
            raise RuntimeError('upload persistence failed')
    assert sql('SELECT * FROM package_review_schedule') == []


def test_due_approval_notifies_once_and_audits(db):
    package()
    version()
    enable()
    due()
    notify = Mock()
    run_once(notify=notify)
    run_once(notify=notify)
    notify.assert_called_once()
    assert sql("SELECT data->>'state' FROM packages WHERE resource_id=1")[0][0] == str(pb.NORMAL)
    assert sql('SELECT * FROM package_review_schedule') == []
    assert sql("SELECT actor FROM site_settings_audit WHERE action='package_auto_approved'") == [('system',)]


def test_disable_then_reenable_preserves_deadline(db):
    package()
    version()
    enable()
    due()
    enable(False)
    assert approve() is None
    assert len(sql('SELECT * FROM package_review_schedule')) == 1
    enable()
    assert approve() is not None


@pytest.mark.parametrize('state', [pb.NORMAL, pb.HIDDEN, pb.SCHEDULED_DELETE, pb.DELETED])
def test_manual_handling_cancels_automatic_approval(db, state):
    package()
    version()
    enable()
    due()
    sql("UPDATE packages SET data=jsonb_set(data::jsonb, '{state}', %s::jsonb)::json WHERE resource_id=1", (str(state),))
    assert approve() is None
    assert sql('SELECT * FROM package_review_schedule') == []


def test_last_version_deletion_cancels_and_reupload_restarts(db):
    package()
    a = version()
    b = version()
    due()
    first = sql('SELECT approve_at FROM package_review_schedule')[0][0]
    sql('DELETE FROM binaries WHERE resource_id=%s', (a,))
    assert sql('SELECT approve_at FROM package_review_schedule')[0][0] == first
    sql('DELETE FROM binaries WHERE resource_id=%s AND parent=%s', (b, 'categories/1/packages/1'))
    assert sql('SELECT * FROM package_review_schedule') == []
    version()
    assert sql('SELECT approve_at FROM package_review_schedule')[0][0] > first


def test_deleted_package_cannot_be_approved(db):
    package()
    version()
    sql("DELETE FROM packages WHERE resource_id=1")
    assert sql('SELECT * FROM package_review_schedule') == []
    assert approve() is None


def test_two_workers_only_one_can_approve(db):
    package()
    version()
    enable()
    due()
    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(lambda _: approve(), range(2)))
    assert sum(value is not None for value in results) == 1


def test_content_update_does_not_restore_stale_state(db):
    package()
    version()
    enable()
    due()
    assert approve() is not None
    storage = PostgresResourceStorage()
    storage.update_fields('packages', 'categories/1', 1, {'description': 'new content'})
    assert sql("SELECT data->>'state', data->>'description' FROM packages WHERE resource_id=1") == [('1', 'new content')]
    assert storage.update_fields('packages', 'categories/1', 1, {'state': pb.NORMAL}, expected_state=pb.UNDER_REVIEW) is None


def test_committed_disable_wins_over_waiting_worker(db):
    package()
    version()
    enable()
    due()
    # Hold the settings write open while a worker attempts to read it.
    with ThreadPoolExecutor(max_workers=1) as executor:
        with db_util.connection() as conn, conn.cursor() as cursor:
            cursor.execute('UPDATE site_settings SET package_auto_approval_enabled=false')
            future = executor.submit(approve)
        assert future.result(timeout=5) is None
    assert sql("SELECT data->>'state' FROM packages WHERE resource_id=1") == [('2',)]


def test_invalid_legacy_data_rolls_back_approval(db):
    package()
    version()
    enable()
    due()
    sql("UPDATE packages SET data=jsonb_set(data::jsonb, '{create_time}', '\"invalid\"'::jsonb)::json WHERE resource_id=1")
    with pytest.raises(ValueError):
        approve()
    assert sql("SELECT data->>'state' FROM packages WHERE resource_id=1") == [('2',)]
    assert len(sql('SELECT * FROM package_review_schedule')) == 1
    assert sql("SELECT * FROM site_settings_audit WHERE action='package_auto_approved'") == []
