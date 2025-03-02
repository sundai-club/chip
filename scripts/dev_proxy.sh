#!/usr/bin/env bash

set -euo pipefail

NAME="aihelper-dev-proxy"

echo "$PWD"
cd "./scripts"

# Arguments: IS_LOCAL boolean
IS_LOCAL=${1:-0}
if [ "$IS_LOCAL" = 1 ]; then
  export PROXY_TARGET="http://host.docker.internal:8000"
else
  export PROXY_TARGET="https://app.bighelp.ai"
fi
envsubst < "./nginx.conf.template" '${PROXY_TARGET}' > "./nginx.conf"
docker build -t "$NAME" . --no-cache

# Stop and remove the container if it exists
docker stop "$NAME" || true
docker rm "$NAME" || true
docker run -d --name "$NAME" -p 127.0.0.1:80:80 "$NAME"
echo "React app is running with access to API at http://localhost:80"
