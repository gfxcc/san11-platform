FROM ubuntu:18.04

WORKDIR /app

ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV DB_NAME="san11-platform-db"
ENV DB_USER="postgres"
ENV DB_PASSWORD="example"

RUN apt-get update -y && \
    apt-get install build-essential software-properties-common -y && \
    apt-get install postgresql -y && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get install python3 python3-pip python3.8-dev libpq-dev -y

# Install grpc related lib here as it takes a long time to build
# Have a different layer will prevent us from rebuild them whenever 
#   requirements.txt get updated
RUN python3.8 -m pip install grpcio grpcio-tools

COPY ./requirements.txt /tmp/requirements.txt
RUN python3.8 -m pip install -r /tmp/requirements.txt
