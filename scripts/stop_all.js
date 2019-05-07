#!/usr/bin/env node

const kill = require('tree-kill');
const chalk = require('chalk');

const { getAllPids } = require('./utils');

const killPromise = (pidName, [pid, keepAlive]) => {
  if (keepAlive) {
    console.log(`Keeping "${pidName}" (${pid}) alive`);
    return;
  }
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
  const pids = getAllPids();
  await Promise.all(Object.keys(pids).map(name => killPromise(name, pids[name])));
  console.info(chalk.greenBright('Teardown done.'));
  process.exit(0);
};

teardown().catch(caughtError => {
  console.error('Error tearing down');
  console.error(caughtError);
  process.exit(1);
});
