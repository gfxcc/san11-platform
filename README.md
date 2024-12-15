# [san11-platform](https://san11pk.org)
A web platform to share San11 related tools

# Usage

## Prepare VM environment (ubuntu)

### Install Dependencies

1. Follow https://docs.docker.com/engine/install/ubuntu/#installation-methods to install docker.

2. Grant permission to current user
```sh
sudo systemctl start docker
sudo usermod -aG docker ${USER}
# apply group membership changes immediately
newgrp docker
```

## Start services
```sh
cd san11-platform
docker compose -f compose.yaml -f compose.prod.yaml build
docker compose -f compose.yaml -f compose.prod.yaml up
```

# Staging env

```sh
cd san11-platform
docker compose -f compose.yaml -f compose.staging.yaml build
docker compose -f compose.yaml -f compose.staging.yaml up
```

# Development

## Start backend & frontend
```sh
cd san11-platform

docker compose -f compose.yaml -f compose.dev.yaml build
docker compose -f compose.yaml -f compose.dev.yaml up
```

## Tests
```sh
make test
```
