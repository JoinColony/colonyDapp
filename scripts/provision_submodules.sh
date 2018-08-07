#!/bin/bash

# Paths
LIB_PATH="src/lib"

CLIENT="colonyJS"
WALLET="colony-wallet"
NETWORK="colonyNetwork"
PINNING="pinningService"

ROOT_PATH=$(pwd)

log() {
  # Colors
  GREEN='\033[0;32m'
  NC='\033[0m' # No Color
  # Weights
  BOLD='\033[1m'
  echo "${GREEN}${BOLD}$1${NC}"
}

# Update / re-pull submodules
log "Initialize submodule libs"
git submodule update --init --recursive

# Build client
log "Building '${CLIENT}' submodule"
# We need global lerna to build the client's packages, make sure we have installed globally
#
yarn global add lerna
cd "${LIB_PATH}/${CLIENT}"
yarn --ignore-engines
lerna run build
cd ${ROOT_PATH}

# Build wallet
log "Building '${WALLET}' submodule"
cd "${LIB_PATH}/${WALLET}"
yarn
yarn build:dev
cd ${ROOT_PATH}

# Build network
log "Building '${NETWORK}' submodule"
cd "${LIB_PATH}/${NETWORK}"
git submodule update --init
yarn
cd ${ROOT_PATH}

# Build pinning service
log "Building '${PINNING}' submodule"
cd "${LIB_PATH}/${PINNING}"
yarn
cd ${ROOT_PATH}
