#!/usr/bin/env node

const path = require('path');
const waitOn = require('wait-on');
const { spawn } = require('child_process');

const { getProcess } = require('./utils');

let stdio;

const startStarSignal = async () => {
  const existingProcess = await getProcess('starSignal');
  if (existingProcess) {
    console.info('Got existing star signal...');
    return existingProcess;
  }

  console.info('Starting new star signal...');
  const process = spawn('yarn', ['star-signal', '--port=9091', '--host=127.0.0.1'], {
    stdio,
    detached: true,
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
