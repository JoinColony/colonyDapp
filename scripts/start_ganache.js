#!/usr/bin/env node

const waitOn = require('wait-on');
const { spawn } = require('child_process');
const { NETWORK_ROOT } = require('./paths');
const { getProcess } = require('./utils');
const deployContracts = require('./deploy_contracts');

const deployContractsPromise = () =>
  new Promise((resolve, reject) => {
    const contractProcess = deployContracts();
    contractProcess.on(
      'exit',
      code =>
        code ? reject(new Error('Contract deployment failed')) : resolve(true),
    );
    contractProcess.on('error', reject);
  });

let stdio;

const startGanache = async () => {
  const existingProcess = await getProcess('ganache');
  if (existingProcess) {
    console.info('Got existing ganache, not deploying contracts...');
    return existingProcess;
  }

  console.info('Starting new ganache...');
  const process = spawn('yarn', ['start:blockchain:client'], {
    stdio,
    detached: true,
    cwd: NETWORK_ROOT,
  });
  await waitOn({ resources: ['tcp:8545'] });

  console.info('Deploying contracts...');
  await deployContractsPromise();

  return process;
};

if (require.main === module) {
  stdio = 'inherit';
  startGanache();
} else {
  stdio = 'pipe';
  module.exports = startGanache;
}
