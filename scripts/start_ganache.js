#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');
const { NETWORK_ROOT } = require('./paths');

let stdio;

const startGanache = () => {
  return spawn('yarn', ['start:blockchain:client'], {
    stdio,
    cwd: NETWORK_ROOT,
  });
}

if (require.main === module) {
  stdio = 'inherit';
  startGanache();
} else {
  stdio = 'pipe';
  module.exports = startGanache;
}







