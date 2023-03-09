#!/bin/bash

# Start cron daemon
/usr/sbin/cron &

# Start the PostgreSQL server
exec docker-entrypoint.sh postgres