FROM postgres:15.2

COPY init.sql /tmp/init.sql
COPY san11-platform-database.sql /tmp/san11-platform-database.sql
 
RUN mkdir /scripts
COPY scripts/* /scripts/

RUN cat /tmp/init.sql > /docker-entrypoint-initdb.d/init.sql && \
        cat /tmp/san11-platform-database.sql >> /docker-entrypoint-initdb.d/init.sql

# Setup cronjob
RUN apt-get update && apt-get install -y cron
COPY config/cronjob /etc/cron.d/db-jobs
RUN chmod 0644 /etc/cron.d/db-jobs
RUN crontab /etc/cron.d/db-jobs

ENTRYPOINT [ "/scripts/docker-entrypoint.sh" ]