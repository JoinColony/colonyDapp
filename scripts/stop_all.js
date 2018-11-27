#!/usr/bin/env node

const path = require('path');

const kill = require('tree-kill');

const { PID_FILE } = require('./paths');

const killPromise = pid =>
  new Promise((resolve, reject) => {
    kill(pid, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(pid);
    });
  });

const teardown = async () => {
  console.info('Closing everything...');
  let pids;
  try {
    pids = require(PID_FILE);
  } catch (e) {
    console.log(e);
    return console.log('PID file not found. Please close the processes manually.');
  }
  const { ganache, trufflepig, webpack } = pids;
  await killPromise(ganache);
  await killPromise(trufflepig);
  await killPromise(webpack);
  console.info('Teardown done.');
};

teardown();
