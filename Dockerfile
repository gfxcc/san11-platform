FROM ubuntu:20.04

WORKDIR /app

ENV TZ=America/Los_Angeles
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update -y && \
    apt-get install build-essential libffi-dev software-properties-common -y && \
    apt-get install python3 python3-pip python3.8-dev libpq-dev -y
RUN apt-get install git npm nodejs protobuf-compiler uuid-runtime curl -y 

# Install buf
RUN BIN="/usr/local/bin" && \
    VERSION="1.27.2" && \
    curl -sSL \
        "https://github.com/bufbuild/buf/releases/download/v${VERSION}/buf-$(uname -s)-$(uname -m)" \
        -o "${BIN}/buf" && \
        chmod +x "${BIN}/buf"

RUN python3.8 -m pip install --upgrade pip

COPY ./back-end/requirements.txt /tmp/requirements.txt
RUN python3.8 -m pip install -r /tmp/requirements.txt

COPY ./back-end/requirements-dev.txt /tmp/requirements-dev.txt
RUN python3.8 -m pip install -r /tmp/requirements-dev.txt

# Install golang env
# See https://github.com/grpc-ecosystem/grpc-gateway/tree/main#installation
RUN apt-get install golang-go -y 
RUN mkdir -p /install-go
COPY ./back-end/gateway/tools.go /install-go/tools.go
ENV PATH="${PATH}:~/go/bin"
RUN cd /install-go && \
    go mod init tools
# RUN cd /install-go && go mod tidy
# RUN cd /install-go && go install \
#         github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway \
#         github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2 \
#         google.golang.org/protobuf/cmd/protoc-gen-go \
#         google.golang.org/grpc/cmd/protoc-gen-go-grpc