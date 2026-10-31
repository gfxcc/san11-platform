FROM postgres:13.10

COPY init.sql /tmp/init.sql
COPY san11-platform-database.sql /tmp/san11-platform-database.sql
 
RUN mkdir /scripts
COPY scripts/* /scripts/

RUN cat /tmp/init.sql > /docker-entrypoint-initdb.d/init.sql && \
        cat /tmp/san11-platform-database.sql >> /docker-entrypoint-initdb.d/init.sql

# cron comes from Debian; the PostgreSQL image also lists the retired Bullseye PGDG repository.
RUN apt-get -o Dir::Etc::sourceparts=- update && \
    apt-get -o Dir::Etc::sourceparts=- install -y cron && \
    rm -rf /var/lib/apt/lists/*
COPY config/cronjob /etc/cron.d/db-jobs
RUN chmod 0644 /etc/cron.d/db-jobs
RUN crontab /etc/cron.d/db-jobs

ENTRYPOINT [ "/scripts/docker-entrypoint.sh" ]
