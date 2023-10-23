FROM golang:1.21.3

WORKDIR /app

COPY ./go.mod /app/go.mod
COPY ./main.go /app/main.go
COPY ./gen /app/gen

RUN go mod tidy
