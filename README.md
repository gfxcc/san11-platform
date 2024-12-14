# [san11-platform](https://san11pk.org)
A web platform to share San11 related tools

# Usage

## Prepare VM environment (ubuntu)

### Install Dependencies
```sh
sudo apt-get update && sudo apt-get install docker -y
sudo systemctl start docker
sudo usermod -aG docker ${USER}
# apply group membership changes immediately
newgrp docker
```

## Start services
```sh
cd san11-platform
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml build
docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up
```

# Development

## Start backend & frontend
```sh
cd san11-platform

docker compose -f docker-compose.yaml -f docker-compose.dev.yaml build
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up
```

## Tests
```sh
make test
```
