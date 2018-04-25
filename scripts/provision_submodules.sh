#!/bin/bash

# Paths
LIB_PATH="src/lib"
CLIENT_PATH="${LIB_PATH}/colony-js"
WALLET_PATH="${LIB_PATH}/colony-wallet"
NETWORK_PATH="${LIB_PATH}/colonyNetwork"

ROOT_PATH=$(pwd)

# Helper functions
clean() {
  rm -Rf "$1"
  echo "removed $1"
}

log() {
  # Colors
  GREEN='\033[0;32m'
  NC='\033[0m' # No Color
  # Weights
  BOLD='\033[1m'
  echo "${GREEN}${BOLD}$1${NC}"
}

# Cleanup
log "Cleaning up submodule folders"
clean ${CLIENT_PATH}
clean ${WALLET_PATH}
clean ${NETWORK_PATH}

# Update / re-pull submodules
log "Initialize submodule libs"
git submodule update --init --recursive

# Build client
log "Building 'colony-js' submodule"
cd ${CLIENT_PATH}
yarn
lerna run build
cd ${ROOT_PATH}

# Build wallet
log "Building 'colony-wallet' submodule"
cd ${WALLET_PATH}
yarn
yarn build:dev
cd ${ROOT_PATH}

# Build network
log "Building 'colonyNetwork' submodule"
cd ${NETWORK_PATH}
git submodule update --init
yarn
cd ${ROOT_PATH}
