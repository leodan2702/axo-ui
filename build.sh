#!/bin/bash
readonly IMAGE=${1:-axo:ui}
readonly NO_CACHE=${2:-false}
if [ "${NO_CACHE}" = "true" ]; then
    docker build --no-cache -f Dockerfile -t ${IMAGE} .
    exit $?
fi
docker build -f Dockerfile -t ${IMAGE} .