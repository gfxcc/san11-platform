# [san11-platform](https://san11pk.org)
A web platform to share San11 related tools

# Usage

## Prepare VM environment (ubuntu)

### Install Dependencies
```
$ sudo apt-get update && apt-get install docker docker-compose -y
$ sudo systemctl start docker
$ sudo usermod -aG docker ${USER}
$ su -s ${USER}
```

### Network
Need to open ports: 80, 443, 8090

## Start services
```
$ cd san11-platform
$ docker-compose build
$ docker-compose up
```

# Development

## Tests
```
$ make test
```
