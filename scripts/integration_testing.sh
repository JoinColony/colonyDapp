#!/bin/bash

#
# This script accepts the following arguments:
# "--debug"    Will output everything to the console
#

MODE="$1"

# Paths
ROOT_PATH=$(pwd)
LIB_PATH="src/lib"
CLIENT_PATH="${LIB_PATH}/colony-js"
WALLET_PATH="${LIB_PATH}/colony-wallet"
NETWORK_PATH="${LIB_PATH}/colonyNetwork"

# Commands
GANACHE_CLI="node_modules/.bin/ganache-cli"
TRUFFLE_CLI="node_modules/.bin/truffle"

# Ports
GANACHE_PORT="8545"

execute() {
  if [ "$MODE" = "--debug" ]; then
    "$@"
  else
    "$@" > /dev/null 2>&1
  fi;
}

log() {
  # Colors
  GREEN='\033[0;32m'
  NC='\033[0m' # No Color
  # Weights
  BOLD='\033[1m'
  echo "${GREEN}${BOLD}$1${NC}"
}

provision_submodules() {
  log "Provisioning submodules"
  execute yarn provision
}

start_ganache() {
  execute ${GANACHE_CLI} --port ${GANACHE_PORT} --acctKeys ganache-accounts.json &
  log "Ganache Server started on port ${GANACHE_PORT}"
}

compile_contracts() {
  log "Compiling contracts"
  cd ${NETWORK_PATH}
  execute ${TRUFFLE_CLI} migrate --reset --compile-all
  cd ${ROOT_PATH}
}

kill_ganache() {
  GANACHE_PROCESS=$(lsof -i:8545 -t)
  kill -TERM $GANACHE_PROCESS || kill -KILL $GANACHE_PROCESS
  log "Ganache Server with PID ${GANACHE_PROCESS} stopped"
}

test() {
  jest --runInBand --config=jest-integration.conf.json
}

#
# Integration Testing Steps
#

provision_submodules

start_ganache

compile_contracts

test

kill_ganache
