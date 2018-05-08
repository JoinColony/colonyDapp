/* eslint-disable flowtype/require-valid-file-annotation, no-console */

const util = require('util');
const ganache = require('ganache-cli');
const chalk = require('chalk');
const ethereumJsUtil = require('ethereumjs-util');
const childProcess = require('child_process');
const path = require('path');
const fs = require('extfs');
const git = require('simple-git/promise');

const { bufferToHex, privateToAddress } = ethereumJsUtil;
const { isEmptySync } = fs;

let exec = util.promisify(childProcess.exec);

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

/*
 * These were nicked for `colonyNetworks`s test accounts
 */
const accountsPrivateKeys = [
  '0355596cdb5e5242ad082c4fe3f8bbe48c9dba843fe1f99dd8272f487e70efae',
  'e9aebe8791ad1ebd33211687e9c53f13fe8cca53b271a6529c7d7ba05eda5ce2',
  '6f36842c663f5afc0ef3ac986ec62af9d09caa1bbf59a50cdb7334c9cc880e65',
  'f184b7741073fc5983df87815e66425928fa5da317ef18ef23456241019bd9c7',
  '7770023bfebe3c8e832b98d6c0874f75580730baba76d7ec05f2780444cc7ed3',
  'a9442c0092fe38933fcf2319d5cf9fd58e3be5409a26e2045929f9d2a16fb090',
  '06af2c8000ab1b096f2ee31539b1e8f3783236eba5284808c2b17cfb49f0f538',
  '7edaec9e5f8088a10b74c1d86108ce879dccded88fa9d4a5e617353d2a88e629',
  'e31c452e0631f67a629e88790d3119ea9505fae758b54976d2bf12bd8300ef4a',
  '5e383d2f98ac821c555333e5bb6109ca41ae89d613cb84887a2bdb933623c4e3',
  '33d2f6f6cc410c1d46d58f17efdd2b53a71527b27eaa7f2edcade351feb87425',
];

/*
 * Generate a new array of account objects
 * `balance` and `secretKey` props are needed to pass down to `ganache`, while
 * `address` is for convenience to be used during testing.
 */
const accounts = accountsPrivateKeys.map(privateKey => ({
  address: bufferToHex(privateToAddress(`0x${privateKey}`)),
  balance: '0x100000000000000000',
  secretKey: `0x${privateKey}`,
}));

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
    accounts,
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
   * Add the accounts in the global object so they're available inside tests
   */
  global.integrationTestionAccounts = accounts;

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
   * Add submodules info in the global object so they're available inside tests
   */
  /* eslint-disable global-require, import/no-dynamic-require */
  global.submodules = {
    client: {
      package: require(path.resolve(clientPath, 'package.json')),
      path: clientPath,
    },
    wallet: {
      package: require(path.resolve(walletPath, 'package.json')),
      path: walletPath,
    },
    network: {
      package: require(path.resolve(networkPath, 'package.json')),
      path: networkPath,
    },
  };

  /*
   * Start the ganache server
   */
  const ganacheServerPort = '8545';
  /*
   * In WATCH mode, only start the server if this is the first run
   */
  if (global.WATCH && global.WATCH_FIRST_RUN) {
    await global.ganacheServer.listen(ganacheServerPort);
    console.log(
      chalk.green.bold('Ganache Server started on'),
      chalk.bold(`${chalk.gray('http://')}localhost:${ganacheServerPort}`),
    );
  }

  /*
   * Compile the `colonyNetwork` contracts
   *
   * In WATCH mode, only compile contracts if this is the first run
   */
  if (global.WATCH && global.WATCH_FIRST_RUN) {
    const colonyNetworkSubmoduleHead = await git(networkPath).branchLocal();
    console.log(
      chalk.green.bold('Compiling Contracts using'),
      chalk.bold(
        `truffle${chalk.gray('@')}${
          global.submodules.network.package.devDependencies.truffle
        }`,
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
