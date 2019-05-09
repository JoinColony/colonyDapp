#!/usr/bin/env node

const kill = require('tree-kill');
const chalk = require('chalk');

const { PID_FILE } = require('./paths');

const killPromise = (pidName, pid) => {
  console.info(`Killing "${pidName}" (${pid})`);
  return new Promise((resolve, reject) => {
    kill(pid, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(pid);
    });
  });
};

const teardown = async () => {
  console.info('Closing everything...');
  let pids;
  try {
    pids = require(PID_FILE);
  } catch (e) {
    console.log(e);
    return console.log('PID file not found. Please close the processes manually.');
  }
  await Promise.all(Object.keys(pids).map(name => killPromise(name, pids[name])));
  console.info(chalk.greenBright('Teardown done.'));
  process.exit(0);
};

teardown().catch(caughtError => {
  console.error('Error tearing down');
  console.error(caughtError);
  process.exit(1);
});
