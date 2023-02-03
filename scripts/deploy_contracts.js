#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');
const { NETWORK_ROOT } = require('./paths');


const deployContracts = () => {
  return spawn('npx', ['truffle', 'migrate', '--reset', '--compile-all'], {
    stdio: 'inherit',
    cwd: NETWORK_ROOT,
    env: {
      ...process.env,
      DISABLE_DOCKER: true,
    }
  });
}

if (require.main === module) {
  deployContracts();
} else {
  module.exports = deployContracts;
}
