#!/bin/bash
readonly IMAGE=${1:-axo:ui}
readonly NO_CACHE=${2:-false}
readonly DOCKERFILE=${3:-Dockerfile} 
if [ "${NO_CACHE}" = "true" ]; then
    docker build --no-cache -f ${DOCKERFILE} -t ${IMAGE} .
    exit $?
fi
docker build -f ${DOCKERFILE} -t ${IMAGE} .