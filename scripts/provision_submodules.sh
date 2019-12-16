#!/bin/bash

while [ $# -gt 0 ]; do
  case "$1" in
    --skip-colony-network-build)
      SKIP_COLONY_NETWORK_BUILD=true
      ;;
    --skip-pinning-service-build)
      SKIP_PINNING_SERVICE_BUILD=true
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
PINNING="pinion"
SERVER="colonyServer"

ROOT_PATH=$(pwd)

log() {
  # Colors
  GREEN=`tput setaf 2`
  NC=`tput sgr0`
  # Weights
  BOLD=`tput bold`
  echo "${GREEN}${BOLD}$1${NC}"
}

log "Generating ssl certificate"
if [ ! -f ssl/localhost+2.pem ]; then
  cd ssl && mkcert localhost 127.0.0.1 ::1 && cd ${ROOT_PATH}
else
  echo "Certificate already exists"
fi

# Update / re-pull submodules
log "Initialize submodule libs"
git submodule update --init --recursive

if [ "$SKIP_COLONY_NETWORK_BUILD" != true ]
then
    # Build network
    log "Building '${NETWORK}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${NETWORK}"
    yarn
    yarn provision:token:contracts
    cd ${ROOT_PATH}
fi

if [ "$SKIP_PINNING_SERVICE_BUILD" != true ]
then
    # Build pinning service
    log "Building '${PINNING}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${PINNING}"
    yarn
    cd ${ROOT_PATH}
fi

if [ "$SKIP_SERVER_BUILD" != true ]
then
    # Build pinning service
    log "Building '${SERVER}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${SERVER}"
    mkdir -p mongo-data
    npm install
    cd ${ROOT_PATH}
fi
