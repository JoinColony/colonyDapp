#!/usr/bin/env node

const kill = require('tree-kill');
const chalk = require('chalk');
const { spawn } = require("child_process");
const path = require('path');

const { PID_FILE } = require('./paths');

/*
 * Take down the docker containers that were put up by grap-node's docker-compose
 * graph-node, postgres, ipfs
 */
const downWithDockerCompose = async () => {
  await new Promise((resolve, reject) => {
    const stopProcess = spawn('docker-compose', ['stop', 'ipfs', 'postgres', 'graph-node'], {
      cwd: path.resolve(__dirname, '..', 'src/lib/graph-node/docker')
    });

    stopProcess.stdout.pipe(process.stdout);
    stopProcess.stderr.pipe(process.stderr);

    stopProcess.on('exit', errorCode => {
      if (errorCode) {
        return reject(new Error(`docker-compose "stop" process exited with code ${errorCode}`));
      }
      resolve();
    });
  });
  /*
   * Removed stopped docker containers
   */
  await new Promise((resolve, reject) => {
    const removeProcess = spawn('docker-compose', ['rm', '-f'], {
      cwd: path.resolve(__dirname, '..', 'src/lib/graph-node/docker')
    });

    removeProcess.stdout.pipe(process.stdout);
    removeProcess.stderr.pipe(process.stderr);

    removeProcess.on('exit', errorCode => {
      if (errorCode) {
        return reject(new Error(`docker-compose "rm" process exited with code ${errorCode}`));
      }
      resolve();
    });
  });
}

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

  /*
   * We only need cleanup if the start script also started graph-node
   * This happed, most likely, by starting the "heavy" dev script
   */
  if (!!pids['graph-node']) {
    console.log();
    console.log('Taking down "graph-node"\'s docker instances...');
    console.log(chalk.yellowBright('Note that this might take longer, depending on your machine,'));
    console.log(chalk.yellowBright('and might finish after the node process has existed.'));
    await downWithDockerCompose();
  }
};

teardown().then(() => {

  console.info(chalk.bold.green('Teardown done.'));
  process.exit(0);

}).catch(caughtError => {

  console.error('Error tearing down');
  console.error(caughtError);
  process.exit(1);

});
