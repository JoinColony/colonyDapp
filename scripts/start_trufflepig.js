#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const TrufflePig = require('trufflepig');

const { NETWORK_ROOT } = require('./paths');
const { getProcess } = require('./utils');

const CONTRACT_DIR = 'build/contracts';
const GANACHE_KEYFILE = 'ganache-accounts.json';

let pig;

const stopThePig = () => {
  pig.close();
};

const startThePig = async () => {
  console.info(chalk.magentaBright('Starting new trufflepig...'));
  const contractDir = path.resolve(NETWORK_ROOT, CONTRACT_DIR);
  const ganacheKeyFile = path.resolve(NETWORK_ROOT, GANACHE_KEYFILE);
  pig = new TrufflePig({
    contractDir,
    ganacheKeyFile,
  });
  pig.on('ready', apiUrl => console.log(`Serving contracts under ${apiUrl}`));
  pig.on('log', console.log);
  pig.start();
  return pig;
};

if (require.main === module) {
  startThePig();
  process.on('SIGINT', () => {
    console.log('Gracefully shutting down the pig...');
    stopThePig();
    setTimeout(() => process.exit(), 4000);
  });
} else {
  module.exports = startThePig;
}
