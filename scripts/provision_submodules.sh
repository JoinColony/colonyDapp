#!/bin/bash

while [ $# -gt 0 ]; do
  case "$1" in
    --skip-colony-network-build)
      SKIP_COLONY_NETWORK_BUILD=true
      ;;
    --skip-pinning-service-build)
      SKIP_PINNING_SERVICE_BUILD=true
      ;;
    --skip-server-build)
      SKIP_SERVER_BUILD=true
      ;;
    *)
      echo "Invalid argument: $1"
      exit 1
  esac
  shift
done

# Paths
LIB_PATH="src/lib"

NETWORK="colonyNetwork"
SERVER="colonyServer"

ROOT_PATH=$(pwd)

YARN="${ROOT_PATH}/node_modules/.bin/yarn"

log() {
  # Colors
  GREEN=`tput setaf 2`
  NC=`tput sgr0`
  # Weights
  BOLD=`tput bold`
  echo "${GREEN}${BOLD}$1${NC}"
}

cp .env.example .env

# Update / re-pull submodules
log "Initialize submodule libs"
git submodule update --init --recursive

if [ "$SKIP_COLONY_NETWORK_BUILD" != true ]
then
    # Build network
    log "Building '${NETWORK}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${NETWORK}"
    $YARN
    DISABLE_DOCKER=true $YARN provision:token:contracts
    cd ${ROOT_PATH}
fi

if [ "$SKIP_SERVER_BUILD" != true ]
then
    # Build pinning service
    log "Building '${SERVER}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${SERVER}"
    cp .env.example .env
    mkdir -p mongo-data
    npm install
    cd ${ROOT_PATH}
fi
