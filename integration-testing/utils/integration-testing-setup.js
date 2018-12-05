/* eslint-disable flowtype/require-valid-file-annotation, no-console */

const util = require('util');
const chalk = require('chalk');
const childProcess = require('child_process');
const path = require('path');
const net = require('net');
const extfs = require('extfs');

const { isEmptySync } = extfs;

global.DEBUG = process.env.DEBUG || false;
/*
 * If we're in watch mode, so we need to check if this is the first run or not.
 *
 * On the first run, we'll set up ganache and compile contracts, but if we're on
 * a subsequent run, we leave them just as they are.
 * Also, if this is NOT a first run, we're not killing the ganache server in the
 * teardown step.
 */
global.WATCH = process.env.WATCH || false;
global.WATCH_FIRST_RUN = true;

/**
 * Take a process-starting function (exec, spawn, etc)
 * and enable logging if we are in debug mode.
 */
const withLogging = func => {
  if (global.DEBUG) {
    return (...args) => {
      const runner = func(...args);
      runner.stdout.pipe(process.stdout);
      return runner;
    };
  }
  return func;
};

const exec = util.promisify(withLogging(childProcess.exec));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const isPortAvailable = port =>
  new Promise((resolve, reject) => {
    const tester = net
      .createServer()
      .once('error', err =>
        err.code === 'EADDRINUSE' ? resolve(false) : reject(err),
      )
      .once('listening', () =>
        tester.once('close', () => resolve(true)).close(),
      )
      .listen(port);
  });

const waitUntilPortIsTaken = async port => {
  let count = 0;
  // eslint-disable-next-line no-await-in-loop
  while (await isPortAvailable(port)) {
    // await in loop to block until the port is taken.
    // eslint-disable-next-line no-await-in-loop
    await sleep(500);
    count += 1;

    if (count > 100) {
      throw Error(`port ${port} is still not taken after 100 attempts.`);
    }
  }
};

/*
 * Paths
 */
const libPath = path.resolve('src', 'lib');
const pinningServicePath = path.resolve(libPath, 'pinningService');

module.exports = async () => {
  /*
   * Leave an empty line.
   * Since first line of `jest`s output doesn't end with a new line
   */
  console.log();

  /*
   * Tell the user we're in DEBUG mode
   */
  if (global.DEBUG) {
    console.log(chalk.bgYellowBright.black.bold('  DEBUG MODE  \n'));
  }

  /*
   * Checking if submodules are provisioned. If they're not, just re-provision
   *
   * Maybe we also need to check here if we're in watch mode. Although it's very
   * unlikely that submodules are going to change during running of the tests.
   */
  if (isEmptySync(pinningServicePath)) {
    console.log(chalk.yellow.bold('Provisioning submodules'));
    await exec('yarn provision --skip-colony-network-build');
  }

  /*
   * Then start the pinning service if it's not already live.
   */
  const pinningServicePort = '9090';
  const portAvailable = await isPortAvailable(pinningServicePort);
  if (portAvailable) {
    console.log(
      chalk.green.bold('Pinning Service:'),
      chalk.bold('starting...'),
    );

    // Note: we use the regular exec, since we need access to the runner object.
    // Note: we start in detached mode so we can start and kill the processes as a group:
    //    When we spawn the pinning service through yarn it starts a tree of processes.
    //    SIGKILL'ing the root process (yarn) leaves zombie processes. Including the server.
    //    Detailed solution: https://azimi.me/2014/12/31/kill-child_process-node-js.html
    global.pinningService = withLogging(childProcess.spawn)(
      'yarn',
      ['test:integration:start-pinning'],
      { detached: true },
    );
    await waitUntilPortIsTaken(pinningServicePort);

    console.log(
      chalk.green.bold('Pinning Service:'),
      chalk.bold('started'),
      'on port:',
      chalk.bold(pinningServicePort),
    );
  } else {
    console.log(
      chalk.green.bold('Pinning Service:'),
      chalk.bold('skipped'),
      'port:',
      chalk.bold(pinningServicePort),
      'is busy',
    );
    global.pinningService = null;
  }

  /*
   * Start running Jest unit tests
   */
  console.log(chalk.green.bold('Starting integration test suites'));

  /*
   * If WATCH mode, and if this is the first run, at this stage we ran it's course.
   * So it's no longer a first run.
   */
  if (global.WATCH && global.WATCH_FIRST_RUN) {
    global.WATCH_FIRST_RUN = false;
  }

  /*
   * @TODO In WATCH mode run teardown
   *
   * Currently we don't run the teardown step in WATCH mode. This is because we
   * can't run it with the current config options `jest` provides us.
   *
   * If they will ever implement a `globalCleanup` config option, then we could
   * do teardown there.
   *
   * This just affects WATCH mode, in a normal run, cleanup/teardown
   * is performed as expected.
   */
};
