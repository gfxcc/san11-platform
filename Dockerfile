FROM ubuntu:18.04

WORKDIR /app

ENV TZ=America/Los_Angeles

RUN apt-get update -y && \
    apt-get install build-essential libffi-dev software-properties-common \
        git npm protobuf-compiler \
        -y && \
    apt-get install python3 python3-pip python3.8-dev libpq-dev -y

COPY ./requirements.txt /tmp/requirements.txt
RUN python3.8 -m pip install --upgrade pip
RUN python3.8 -m pip install -r /tmp/requirements.txt

