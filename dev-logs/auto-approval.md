# Package auto approval

Admin workspace → Site Settings → Review Settings controls the server-wide switch (off by default). Appearance settings remain browser-local.

`auto-approval` is an independent Compose service, sharing the API image/source, database, environment, and notification credentials. It runs `python -m jobs.package_auto_approval`, processes up to 100 due packages per minute, retries polling after errors, and exits on SIGTERM/SIGINT. Compose restarts it after a crash. All environment overlays include it.

Both API and worker startup call the versioned migration runner under a PostgreSQL advisory lock. Existing volumes are upgraded automatically. Migration 001 adds settings, schedules, audit records, and triggers; no historical schedules are created. Version insert/delete and scheduling commit together, using database time rather than client timestamps. Adding a version schedules only packages currently under review. Future versions do not extend the deadline. Removing the last version clears it. Any moderation action leaving under-review state clears it.

The worker rechecks the saved switch, current package state, deadline, and version existence in a transaction. Settings and owning package locks serialize changes. Disabling waits for in-flight approval commits; completed approvals are not reversed. Re-enabling can approve overdue schedules at the next poll. `site_settings_audit` records administrator setting changes and system approvals. Publication notification runs after the approval commit; a notification failure is logged and does not undo approval or stop the batch.

Local verification: supply `TEST_DATABASE_URL` pointing at a disposable PostgreSQL database, then run `cd back-end && make utest itest PY=.venv/bin/python`. PostgreSQL tests isolate themselves in temporary schemas. CI provisions PostgreSQL for these tests. Browser tests use DEV seeded users and run with `cd front-end && npm run e2e:playwright` against the dev stack.
