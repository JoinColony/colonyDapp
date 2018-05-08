/* eslint-disable flowtype/require-valid-file-annotation, no-console */

const chalk = require('chalk');
const rimraf = require('rimraf');
const util = require('util');

const remove = util.promisify(rimraf);

module.exports = async () => {
  /*
   * Stop the ganache server
   *
   * In WATCH mode, only stop the server if this is the first run
   */
  if (global.WATCH && global.WATCH_FIRST_RUN) {
    await global.ganacheServer.stop();
    console.log(chalk.green.bold('Ganache Server Stopped'));
  }

  /*
   * Cleanup
   *
   * In WATCH mode, only perform cleanup if this is the first run
   */
  if (global.WATCH && global.WATCH_FIRST_RUN) {
    console.log(chalk.green.bold('Cleaning up unneeded files'));
    const cleanupPaths = [
      'ganache-accounts.json',
      `${global.submodules.network.path}/build/contracts`,
    ];
    cleanupPaths.map(async path => {
      if (global.DEBUG) {
        console.log(`Removing: ${path}`);
      }
      await remove(path, { disableGlob: true });
    });
  }

  /*
   * Debug log file
   */
  if (global.DEBUG) {
    console.log(
      chalk.yellow.bold('Saved'),
      chalk.bold('integration-testing-output.log'),
      chalk.yellow.bold('log file'),
    );
  }
};
