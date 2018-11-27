#!/usr/bin/env node

const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { NETWORK_ROOT } = require('./paths');

const waitUntilPortIsOpen = (port, maxTries = 5) => {
  let tries = 0;
  return new Promise((resolve, reject) => {
    const nextTry = () => {
      http
        .get(`http://127.0.0.1:${port}`, () => resolve(true))
        .on('error', () => {
          tries += 1;
          if (tries === maxTries) {
            reject(
              new Error(
                `Could not connect to ganache server after ${tries} tries`,
              ),
            );
            return;
          }
          setTimeout(nextTry, 2000);
        });
    };
    nextTry();
  });
};

let stdio;

const startGanache = async () => {
  const process = spawn('yarn', ['start:blockchain:client'], {
    stdio,
    cwd: NETWORK_ROOT,
  });
  await waitUntilPortIsOpen(8545);
  return process;
}

if (require.main === module) {
  stdio = 'inherit';
  startGanache();
} else {
  stdio = 'pipe';
  module.exports = startGanache;
}
