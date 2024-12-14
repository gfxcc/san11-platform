# [san11-platform](https://san11pk.org)
A web platform to share San11 related tools

# Usage

## Prepare VM environment (ubuntu)

### Install Dependencies
```
$ sudo apt-get update && sudo apt-get install docker docker-compose -y
$ sudo systemctl start docker
$ sudo usermod -aG docker ${USER}
$ su -s ${USER}
```

## Start services
```
$ cd san11-platform
$ docker compose -f docker-compose.yaml -f docker-compose.prod.yaml build
$ docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up
```

# Development

## Start backend & frontend
```
$ cd san11-platform

$ docker compose -f docker-compose.yaml -f docker-compose.dev.yaml build
$ docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up
```

## Tests
```
$ make test
```
