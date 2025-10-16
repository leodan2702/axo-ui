#!/bin/bash
readonly IMAGE=${1:-axo:ui}
readonly PORT=${2:-80}

chmod +x ./deploy_storage.sh && ./deploy_storage.sh
chmod +x ./deploy_platform.sh && ./deploy_platform.sh "$IMAGE" "$PORT"