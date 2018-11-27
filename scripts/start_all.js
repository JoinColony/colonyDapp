#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const startGanache = require('./start_ganache');
const deployContracts = require('./deploy_contracts');

const { PID_FILE } = require('./paths');

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

const trufflePigPromise = () =>
  new Promise((resolve, reject) => {
    const trufflepigProcess = spawn(
      path.resolve(__dirname, './start_trufflepig.js'),
      {
        stdio: 'pipe',
      },
    );
    trufflepigProcess.stdout.on('data', chunk => {
      if (chunk.includes('Serving contracts')) resolve(trufflepigProcess);
    });
    trufflepigProcess.on('error', e => {
      trufflepigProcess.kill();
      reject(e);
    });
  });

const webpackPromise = () =>
  new Promise((resolve, reject) => {
    const webpackProcess = spawn('yarn', ['run', 'dev'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
    });
    webpackProcess.stdout.on('data', chunk => {
      if (chunk.includes('Compiled successfully')) resolve(webpackProcess);
    });
    webpackProcess.on('error', e => {
      webpackProcess.kill();
      reject(e);
    });
  });

const startAll = async () => {
  console.info('Starting ganache...');
  const ganacheProcess = await startGanache();

  console.info('Deploying contracts...');
  await deployContractsPromise();

  console.info('Starting trufflepig...');
  const trufflepigProcess = await trufflePigPromise();

  console.info('Starting webpack...');
  const webpackProcess = await webpackPromise();

  const pids = {
    ganache: ganacheProcess.pid,
    trufflepig: trufflepigProcess.pid,
    webpack: webpackProcess.pid,
  };

  fs.writeFileSync(PID_FILE, JSON.stringify(pids));

  console.info('Stack started successfully.');
};

startAll();
