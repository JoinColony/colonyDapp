#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');
const { NETWORK_ROOT } = require('./paths');

let stdio;

const deployContracts = () => {
  return spawn('node_modules/.bin/truffle', ['migrate', '--reset', '--compile-all'], {
    stdio,
    cwd: NETWORK_ROOT,
  });
}

if (require.main === module) {
  stdio = 'inherit';
  deployContracts();
} else {
  stdio = 'pipe';
  module.exports = deployContracts;
}
