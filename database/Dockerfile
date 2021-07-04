FROM postgres:latest

COPY init.sql /tmp/init.sql
COPY san11-platform-database.sql /tmp/san11-platform-database.sql
RUN cat /tmp/init.sql > /docker-entrypoint-initdb.d/init.sql && \
        cat /tmp/san11-platform-database.sql >> /docker-entrypoint-initdb.d/init.sql
