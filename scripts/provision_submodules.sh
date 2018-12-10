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
PINNING="pinningService"

ROOT_PATH=$(pwd)

log() {
  # Colors
  GREEN=`tput setaf 2`
  NC=`tput sgr0`
  # Weights
  BOLD=`tput bold`
  echo "${GREEN}${BOLD}$1${NC}"
}

# Update / re-pull submodules
log "Initialize submodule libs"
git submodule update --init --recursive

if [ "$SKIP_COLONY_NETWORK_BUILD" != true ]
then
    # Build network
    log "Building '${NETWORK}' submodule"
    cd "${LIB_PATH}/${NETWORK}"
    # git submodule update --init
    yarn
    yarn run provision:token:contracts
    cd ${ROOT_PATH}
fi

if [ "$SKIP_PINNING_SERVICE_BUILD" != true ]
then
    # Build pinning service
    log "Building '${PINNING}' submodule"
    cd "${LIB_PATH}/${PINNING}"
    yarn && yarn build
    cd ${ROOT_PATH}
fi
