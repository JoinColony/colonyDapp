#!/usr/bin/env node

const path = require('path');
const waitOn = require('wait-on');
const { spawn } = require('child_process');

let stdio;

const startStarSignal = async () => {
  const process = spawn('yarn', ['rendezvous', '--port=9091', '--host=127.0.0.1'], {
    stdio,
    cwd: path.resolve(__dirname, '..'),
  });
  await waitOn({ resources: ['tcp:9091'] });
  return process;
};

if (require.main === module) {
  stdio = 'inherit';
  startStarSignal();
} else {
  stdio = 'pipe';
  module.exports = startStarSignal;
}
