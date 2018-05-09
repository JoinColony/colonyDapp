/* eslint-disable flowtype/require-valid-file-annotation, no-console */

const util = require('util');
const ganache = require('ganache-cli');
const chalk = require('chalk');
const childProcess = require('child_process');
const path = require('path');
const fs = require('extfs');
const git = require('simple-git/promise');
const rimraf = require('rimraf');

const { isEmptySync } = fs;

let exec = util.promisify(childProcess.exec);
const remove = util.promisify(rimraf);

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

if (global.DEBUG) {
  exec = util.promisify((...args) => {
    const runner = childProcess.exec(...args);
    runner.stdout.on('data', output => process.stdout.write(output));
    return runner;
  });
}

/*
 * Paths
 */
const libPath = path.resolve('src', 'lib');
const clientPath = path.resolve(libPath, 'colony-js');
const walletPath = path.resolve(libPath, 'colony-wallet');
const networkPath = path.resolve(libPath, 'colonyNetwork');

const cleanupArtifacts = message => {
  console.log(chalk.green.bold(message));
  const cleanupPaths = [
    'ganache-accounts.json',
    `${networkPath}/build/contracts`,
  ];
  cleanupPaths.map(async artifactPath => {
    if (global.DEBUG) {
      console.log(`Removing: ${artifactPath}`);
    }
    await remove(artifactPath, { disableGlob: true });
  });
};

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

  const ganacheServerOptions = {
    default_balance_ether: 100,
    total_accounts: 10,
  };
  const ganacheServerDebugOptions = {
    debug: true,
    logger: console,
  };
  const server = ganache.server(
    Object.assign(
      {},
      ganacheServerOptions,
      global.DEBUG ? ganacheServerDebugOptions : {},
    ),
  );

  global.ganacheServer = {
    listen: util.promisify(server.listen),
    stop: util.promisify(server.close),
  };

  /*
   * Checking if submodules are provisioned. If they're not, just re-provision
   *
   * Maybe we also need to check here if we're in watch mode. Although it's very
   * unlikely that submodules are going to change during running of the tests.
   */
  if (
    isEmptySync(clientPath) ||
    isEmptySync(walletPath) ||
    isEmptySync(networkPath)
  ) {
    console.log(chalk.yellow.bold('Provisioning submodules'));
    await exec('yarn provision');
  }

  /*
   * After we provision the modules, grab the `colonyNetwork` package json
   * so we can read values from it.
   *
   * Before this step, it may not be available
   */
  /* eslint-disable global-require, import/no-dynamic-require */
  const networkPackage = require(path.resolve(networkPath, 'package.json'));

  /*
   * Start the ganache server
   */
  const ganacheServerPort = '8545';
  if (!global.WATCH || (global.WATCH && global.WATCH_FIRST_RUN)) {
    /*
     * Perform initial cleanup, since there's a good chance there are leftover
     * artifacts (build folders)
     */
    global.cleanupArtifacts = cleanupArtifacts;
    cleanupArtifacts('Removing leftover artifacts');

    /*
     * In WATCH mode, only start the server if this is the first run
     */
    await global.ganacheServer.listen(ganacheServerPort);
    console.log(
      chalk.green.bold('Ganache Server started on'),
      chalk.bold(`${chalk.gray('http://')}localhost:${ganacheServerPort}`),
    );

    /*
     * Compile the `colonyNetwork` contracts
     *
     * In WATCH mode, only compile contracts if this is the first run
     */
    const colonyNetworkSubmoduleHead = await git(networkPath).branchLocal();
    console.log(
      chalk.green.bold('Compiling Contracts using'),
      chalk.bold(
        `truffle${chalk.gray('@')}${networkPackage.devDependencies.truffle}`,
      ),
      chalk.green.bold('from'),
      chalk.bold(
        `colonyNetwork${chalk.gray('#')}${colonyNetworkSubmoduleHead.current}`,
      ),
    );
    await exec(
      `${networkPath}/node_modules/.bin/truffle migrate --reset --compile-all`,
      { cwd: networkPath },
    );
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
