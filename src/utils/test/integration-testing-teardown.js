/* eslint-disable flowtype/require-valid-file-annotation, no-console */

const chalk = require('chalk');

module.exports = async () => {
  await global.ganacheServer.stop();
  console.log(chalk.green.bold('Ganache Server Stopped'));
};
