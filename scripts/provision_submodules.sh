#!/bin/bash

while [ $# -gt 0 ]; do
  case "$1" in
    --skip-colony-network-build)
      SKIP_COLONY_NETWORK_BUILD=true
      ;;
    --skip-server-build)
      SKIP_SERVER_BUILD=true
      ;;
    --skip-reputation-build)
      SKIP_REPUTATION_BUILD=true
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
REPUTATION="mock-reputation-miner"

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
    $YARN --pure-lockfile
    DISABLE_DOCKER=true $YARN provision:token:contracts
    cd ${ROOT_PATH}
fi

if [ "$SKIP_SERVER_BUILD" != true ]
then
    log "Building '${SERVER}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${SERVER}"
    cp .env.example .env
    mkdir -p mongo-data
    npm install
    cd ${ROOT_PATH}
fi

# Mock reputation miner
if [ "$SKIP_REPUTATION_BUILD" != true ]
then
    log "Building the '${REPUTATION}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${REPUTATION}"
    log "Generating the '${REPUTATION}' submodule .env file"
    printf "PORT=3001\nHOST=0.0.0.0\nGANACHE_ACCOUNTS_PATH=../colonyNetwork/ganache-accounts.json" >> .env
    log "Installing the '${REPUTATION}' submodule node_modules"
    npm install
    cd ${ROOT_PATH}
fi
