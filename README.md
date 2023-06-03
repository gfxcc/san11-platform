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

### Network
Need to open ports: 80, 443, 8090

## Start services
```
$ cd san11-platform
$ docker-compose build
$ docker-compose up
```

# Development

## Start backend & frontend
```
$ cd san11-platform
$ docker-compose -f docker-compose.dev.yaml up back-end

# In a separate terminal
$ docker-compose -f docker-compose.dev.yaml up front-end
```

## Tests
```
$ make test
```

# Deployment
```
$ cd san11-platform
$ docker-compose up back-end

# In a separate terminal
$ cd san11-platform
$ docker-compose up front-end
```
