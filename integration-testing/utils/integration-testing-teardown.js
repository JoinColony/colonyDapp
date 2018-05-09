/* eslint-disable flowtype/require-valid-file-annotation, no-console */

const chalk = require('chalk');

module.exports = async () => {
  /*
   * Stop the ganache server
   *
   * In WATCH mode, only stop the server if this is the first run
   */
  if (!global.WATCH || (global.WATCH && global.WATCH_FIRST_RUN)) {
    await global.ganacheServer.stop();
    console.log(chalk.green.bold('Ganache Server Stopped'));

    global.trufflePigServer.close();
    console.log(chalk.green.bold('TrufflePig Server Stopped'));

    /*
     * Cleanup
     *
     * In WATCH mode, only perform cleanup if this is the first run
     */
    global.cleanupArtifacts('Cleaning up unneeded files');
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
