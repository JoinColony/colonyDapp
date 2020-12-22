#!/bin/bash

while [ $# -gt 0 ]; do
  case "$1" in
    --skip-colony-network-build)
      SKIP_COLONY_NETWORK_BUILD=true
      ;;
    --skip-server-build)
      SKIP_SERVER_BUILD=true
      ;;
    --skip-oracle-build)
      SKIP_ORACLE_BUILD=true
      ;;
    --skip-subgraph-build)
      SKIP_SUBGRAPH_BUILD=true
      ;;
    --skip-graph-node-build)
      SKIP_GRAPH_NODE_BUILD=true
      ;;
    *)
      echo "Invalid argument: $1"
      exit 1
  esac
  shift
done

# Paths
LIB_PATH="src/lib"
ENV_FILE="./.env"

NETWORK="colonyNetwork"
SERVER="colonyServer"
ORACLE="mock-oracle"
SUBGRAPH="subgraph"
GRAPH_NODE="graph-node"

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

warn() {
  # Colors
  RED=`tput setaf 3`
  NC=`tput sgr0`
  # Weights
  BOLD=`tput bold`
  echo
  echo "${RED}${BOLD}$1${NC}"
  echo
}

err() {
  # Colors
  RED=`tput setaf 1`
  NC=`tput sgr0`
  # Weights
  BOLD=`tput bold`
  echo
  echo "${RED}${BOLD}$1${NC}"
  echo
}

# Setup the dapp's env file
if [ -f "$ENV_FILE" ]; then
    warn "The Dapp .env file already exists, skipping generating it"
else
    log "Generating the \"Dapp's\" submodule .env file"
    cp .env.example .env
fi

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
else
    warn "Skipping '${NETWORK}' submodule provision"
fi

if [ "$SKIP_SERVER_BUILD" != true ]
then
    log "Building '${SERVER}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${SERVER}"
    cp .env.example .env
    mkdir -p mongo-data
    npm install
    cd ${ROOT_PATH}
else
    warn "Skipping '${SERVER}' submodule provision"
fi

# Mock reputation miner
if [ "$SKIP_ORACLE_BUILD" != true ]
then
    log "Building the '${ORACLE}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${ORACLE}"
    log "Generating the '${ORACLE}' submodule .env file"
    printf "PORT=3001\nHOST=0.0.0.0\nGANACHE_ACCOUNTS_PATH=../colonyNetwork/ganache-accounts.json" >> .env
    log "Installing the '${ORACLE}' submodule node_modules"
    npm install
    cd ${ROOT_PATH}
else
    warn "Skipping '${ORACLE}' submodule provision"
fi

# Subgraph
if [ "$SKIP_SUBGRAPH_BUILD" != true ]
then
    err "If this is your first time installing, \"@graphprotocol/graph-ts\" will take a long time"
    log "Building the '${SUBGRAPH}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${SUBGRAPH}"
    log "Installing the '${SUBGRAPH}' submodule node_modules"
    npm install
    cd ${ROOT_PATH}
else
    warn "Skipping '${SUBGRAPH}' submodule provision"
fi

# Graph Node
if [ "$SKIP_GRAPH_NODE_BUILD" != true ]
then
    log "Building the '${GRAPH_NODE}' submodule"
    cd "${ROOT_PATH}/${LIB_PATH}/${GRAPH_NODE}"
    log "Installing the '${GRAPH_NODE}' submodule node_modules"
    npm install
    cd ${ROOT_PATH}
else
    warn "Skipping '${GRAPH_NODE}' submodule provision"
fi
