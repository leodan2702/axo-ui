#!/bin/bash
readonly IMAGE=${1:-axo:ui}
readonly PORT=${2:-80}
readonly ENV_FILE=${3:-.env.dev}

docker compose -p axo -f axo-platform.yml down

docker compose --env-file $ENV_FILE -p axo -f axo-platform.yml up -d --build

# docker build -f ./Dockerfile -t $IMAGE .
# docker run --name axo-ui -p $PORT:80  --network=mictlanx -d $IMAGE
