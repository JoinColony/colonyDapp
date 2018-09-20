/* eslint-disable flowtype/require-valid-file-annotation, no-console */

const chalk = require('chalk');

module.exports = async () => {
  /*
   * Stop the pinning service if we started it.
   */
  if (global.pinningService !== null) {
    console.log(chalk.green.bold('Pinning Service:'), chalk.bold('killing'));

    // The process may have exited unexpectedly, so use a signal of `0`
    // and ignore errors with the string `ESRCH` (indicating that the process
    // wasn't found).
    try {
      process.kill(-global.pinningService.pid, 0); // use `-` to target the process group.
    } catch (error) {
      if (!error.toString().includes('ESRCH')) throw error;
    }
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

  /*
   * If we're NOT in WATCH mode, manually kill the process
   *
   * This is because one of the servers hang and doesn't allow the test runner
   * to shut down gracefully.
   *
   * I suspect this is comming from TrufflePig, but it will require further
   * investigation to be sure.
   *
   * @TODO Cleaner test runner shutdown
   *
   * Find a way to close the process and not rely on `process.exit()`
   */
  if (!global.WATCH) {
    process.exit();
  }
};
