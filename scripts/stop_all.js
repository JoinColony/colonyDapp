#!/usr/bin/env node

const fs = require('fs');
const kill = require('tree-kill');
const chalk = require('chalk');
const args = require('minimist')(process.argv);

const { PID_FILE } = require('./paths');
const { getAllPids } = require('./utils');

const killPromise = async (pidName, [pid, keepAlive]) => {
  if (!args.killEverything && keepAlive) {
    console.log(`Keeping "${pidName}" (${pid}) alive`);
    return { [pidName]: [pid, keepAlive] };
  }

  console.info(`Killing "${pidName}" (${pid})`);
  await new Promise((resolve, reject) => {
    kill(pid, err => {
      if (err) {
        reject(err);
        return;
      }
      resolve(pid);
    });
  });
  return null;
};

const teardown = async () => {
  const pids = getAllPids();

  const newPids = (
    await Promise.all(
      Object.keys(pids).map(name => killPromise(name, pids[name]))
    )
  )
    .filter(Boolean)
    .reduce((result, obj) => ({ ...result, ...obj }), {});

  fs.writeFileSync(PID_FILE, JSON.stringify(newPids));

  console.info(chalk.greenBright('Teardown done.'));
  process.exit(0);
};

teardown().catch(caughtError => {
  console.error('Error tearing down');
  console.error(caughtError);
  process.exit(1);
});
