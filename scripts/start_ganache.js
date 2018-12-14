#!/usr/bin/env node

const path = require('path');
const waitOn = require('wait-on');
const { spawn } = require('child_process');
const { NETWORK_ROOT } = require('./paths');

let stdio;

const startGanache = async () => {
  const process = spawn('yarn', ['start:blockchain:client'], {
    stdio,
    cwd: NETWORK_ROOT,
  });
  await waitOn({ resources: ['tcp:8545'] });
  return process;
}

if (require.main === module) {
  stdio = 'inherit';
  startGanache();
} else {
  stdio = 'pipe';
  module.exports = startGanache;
}
