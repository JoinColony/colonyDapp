#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');
const fs = require('fs');
const args = require('minimist')(process.argv);
const chalk = require('chalk');

const startGanache = require('./start_ganache');
const startStarSignal = require('./start_star_signal');
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
    if (args.foreground) {
      trufflepigProcess.stdout.pipe(process.stdout);
      trufflepigProcess.stderr.pipe(process.stderr);
    }
    trufflepigProcess.on('error', e => {
      trufflepigProcess.kill();
      reject(e);
    });
  });

const webpackPromise = () =>
  new Promise((resolve, reject) => {
    const webpackProcess = spawn('yarn', ['run', 'webpack'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
    });
    webpackProcess.stdout.on('data', chunk => {
      if (chunk.includes('Compiled successfully')) resolve(webpackProcess);
    });
    if (args.foreground) {
      webpackProcess.stdout.pipe(process.stdout);
      webpackProcess.stderr.pipe(process.stderr);
    }
    webpackProcess.on('error', e => {
      webpackProcess.kill();
      reject(e);
    });
  });


const ipfsdPromise = () =>
  new Promise((resolve, reject) => {
    const ipfsdProcess = spawn('yarn', ['ipfsd'], {
      cwd: path.resolve(__dirname, '..', 'src/lib/pinion'),
      stdio: 'pipe',
    });
    ipfsdProcess.stdout.on('data', chunk => {
      if (chunk.includes('Daemon is ready')) resolve(ipfsdProcess);
    });
    if (args.foreground) {
      ipfsdProcess.stdout.pipe(process.stdout);
      ipfsdProcess.stderr.pipe(process.stderr);
    }
    ipfsdProcess.on('error', e => {
      console.error(e);
      webpackProcess.kill();
      reject(e);
    });
  });

const pinionProc = () => {
  const pinionProcess = spawn('yarn', ['start'], {
    cwd: path.resolve(__dirname, '..', 'src/lib/pinion'),
    stdio: 'pipe',
  });
  if (args.foreground) {
    pinionProcess.stdout.pipe(process.stdout);
    pinionProcess.stderr.pipe(process.stderr);
  }
  pinionProcess.on('error', e => {
    console.error(e);
    pinionProcess.kill();
  });
  return pinionProcess;
}

const wssProxyPromise = async () => {
  const wssProxyProcess = spawn(
    path.resolve(__dirname, './start_wss_proxy.js'),
    {
      stdio: 'pipe',
    },
  );
  await waitOn({ resources: ['tcp:4004'] });
  return wssProxyProcess;
};

const startAll = async () => {
  try {
    console.info('Starting ganache...');
    const ganacheProcess = await startGanache();

    console.info('Deploying contracts...');
    await deployContractsPromise();

    console.info(chalk.magentaBright('Starting trufflepig...'));
    const trufflepigProcess = await trufflePigPromise();

    console.info('Starting star signal...');
    const starSignalProcess = await startStarSignal();

    console.info('Starting ipfsd');
    const ipfsdProcess = await ipfsdPromise();

    console.info('Starting pinion...');
    const pinionProcess = pinionProc();

    console.info('Starting websocket proxy...');
    const wssProxyProcess = await wssProxyPromise();

    console.info('Starting webpack...');
    const webpackProcess = await webpackPromise();

    const pids = {
      ganache: ganacheProcess.pid,
      ifpsd: ipfsdProcess.pid,
      pinion: pinionProcess.pid,
      trufflepig: trufflepigProcess.pid,
      webpack: webpackProcess.pid,
      starSignal: starSignalProcess.pid,
      wssProxy: wssProxyProcess.pid,
    };

    fs.writeFileSync(PID_FILE, JSON.stringify(pids));
  } catch (e) {
    console.info(chalk.redBright('Stack start failed.'));
    console.info(chalk.redBright(e.message));
    process.exit(1);
  }

  console.info('Reticulating splines...');

  console.info(chalk.greenBright('Stack started successfully.'));
};

process.on('SIGINT', () => {
  spawn(path.resolve(__dirname, 'stop_all.js'), {
    detached: true,
    stdio: 'inherit',
  });
  process.exit(0);
});

startAll().catch(caughtError => {
  console.error('Error starting');
  console.error(caughtError);
  process.exit(1);
});
