#!/usr/bin/env node

const path = require('path');
const TrufflePig = require('trufflepig');
const { NETWORK_ROOT } = require('./paths');

const CONTRACT_DIR = 'build/contracts';
const GANACHE_KEYFILE = 'ganache-accounts.json';

let pig;

const stopThePig = () => {
  pig.close();
}

const startThePig = () => {
  const contractDir = path.resolve(NETWORK_ROOT, CONTRACT_DIR);
  const ganacheKeyFile = path.resolve(NETWORK_ROOT, GANACHE_KEYFILE);
  pig = new TrufflePig({
    contractDir,
    ganacheKeyFile,
  });
  pig.on('ready', apiUrl => console.log(`Serving contracts under ${apiUrl}`))
  pig.on('log', console.log);
  pig.start();
  return pig;
}

if (require.main === module) {
  const pig = startThePig();
  process.on('SIGINT', () => {
    console.log('Gracefully shutting down the pig...');
    stopThePig();
    setTimeout(() => process.exit(), 4000);
  });
} else {
  module.exports = startThePig;
}
