#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');
const { NETWORK_ROOT } = require('./paths');

let stdio;

const deployContracts = () => {
  return spawn('truffle', ['migrate', '--reset', '--compile-all'], {
    stdio,
    cwd: NETWORK_ROOT,
    env: {
      PATH: `${process.env.PATH}:node_modules/.bin`,
    },
  });
}

if (require.main === module) {
  stdio = 'inherit';
  deployContracts();
} else {
  stdio = 'pipe';
  module.exports = deployContracts;
}
