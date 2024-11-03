#!/bin/bash

DOMAIN="san11pk.org"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
DEST_PATH="$HOME/credentials"
ENVY_CONTAINER="san11platform_envoy_1"
ANGULAR_CONTAINER="san11platform_front-end_1"

# Post-hook to start containers and copy certificates
echo "Copying certificates to the desired location..."
sudo cp -L "$CERT_PATH/fullchain.pem" "$DEST_PATH/san11pk.crt"
sudo cp -L "$CERT_PATH/privkey.pem" "$DEST_PATH/san11pk-private-key.key"

echo "Restarting Envoy and Angular containers..."
docker start $ENVY_CONTAINER
docker restart $ANGULAR_CONTAINER

echo "Finish renew certificate"

