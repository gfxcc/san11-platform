FROM ubuntu:20.04

WORKDIR /app

ENV TZ=America/Los_Angeles
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV DB_NAME="san11-platform-db"
ENV DB_USER="postgres"
ENV DB_PASSWORD="example"

RUN apt-get update -y && \
    apt-get install build-essential libffi-dev software-properties-common -y && \
    apt-get install postgresql -y && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get install python3 python3-pip python3.8-dev libpq-dev python3-setuptools -y

# Install grpc related libs in a separate layer so requirements.txt changes do
# not invalidate them. Upgrade pip first so it can resolve manylinux aarch64
# wheels instead of compiling grpc from source.
RUN python3.8 -m pip install --upgrade pip setuptools
RUN python3.8 -m pip install --only-binary=:all: grpcio==1.70.0 grpcio-tools==1.70.0

COPY ./requirements.txt /tmp/requirements.txt
RUN python3.8 -m pip install -r /tmp/requirements.txt
