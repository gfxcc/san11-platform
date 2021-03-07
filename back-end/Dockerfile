FROM ubuntu:18.04


WORKDIR /app

RUN apt-get update -y && \
    apt-get install build-essential software-properties-common -y && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get install python3 python3-pip python3.8-dev libpq-dev -y

COPY ./requirements.txt /tmp/requirements.txt
RUN python3.8 -m pip install -r /tmp/requirements.txt
