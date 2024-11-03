#!/bin/bash

ENVY_CONTAINER="san11platform_envoy_1"

# Pre-hook to stop containers using port 80
echo "Stopping containers using port 80..."
docker stop $ENVY_CONTAINER

