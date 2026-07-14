#!/bin/bash

cd "$(dirname "$0")"

# Check if the network exists, if not, create it
if ! docker network inspect kc_shared_central_nginx_proxy_network >/dev/null 2>&1; then
    echo "Network 'kc_shared_central_nginx_proxy_network' not found. Creating it..."
    docker network create kc_shared_central_nginx_proxy_network
else
    echo "Network 'kc_shared_central_nginx_proxy_network' already exists. Skipping."
fi

docker-compose build
docker-compose up -d
