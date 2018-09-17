#!/bin/bash

# Paths
LIB_PATH="src/lib"

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
