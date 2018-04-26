/* eslint-disable flowtype/require-valid-file-annotation, no-console */
const util = require('util');
const ganache = require('ganache-cli');
const chalk = require('chalk');

module.exports = async () => {
  const server = ganache.server({
    debug: true,
    logger: console,
    default_balance_ether: 100,
    total_accounts: 10,
  });

  global.ganacheServer = {
    listen: util.promisify(server.listen),
    stop: util.promisify(server.close),
  };

  await global.ganacheServer.listen('8545');
  console.log(chalk.green.bold('\nGanache Server Started'));
};
