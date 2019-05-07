#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');
const fs = require('fs');
const args = require('minimist')(process.argv);
const chalk = require('chalk');

const startGanache = require('./start_ganache');
const startStarSignal = require('./start_star_signal');
const { getProcess } = require('./utils');
const { PID_FILE } = require('./paths');

const trufflePigPromise = async () => {
  const existingProcess = await getProcess('trufflepig');
  if (existingProcess) {
    console.info(chalk.magentaBright('Got existing trufflepig...'));
    return existingProcess;
  }
  return new Promise((resolve, reject) => {
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
};

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

const wssProxyPromise = async () => {
  const wssProxyProcess = spawn(
    path.resolve(__dirname, './start_wss_proxy.js'),
    {
      stdio: 'pipe',
    },
  );
  await waitOn({ resources: ['tcp:4003'] });
  return wssProxyProcess;
};

const startAll = async () => {
  try {
    const ganacheProcess = await startGanache();

    const trufflepigProcess = await trufflePigPromise();

    // This will probably be replaced with pinion
    const starSignalProcess = await startStarSignal();

    // This is temporarily disabled until we actually *really* need it
    // const wssProxyProcess = await wssProxyPromise();

    console.info('Starting webpack...');
    const webpackProcess = await webpackPromise();

    const pids = {
      ganache: [ganacheProcess.pid, args.keepAliveGanache],
      trufflepig: [trufflepigProcess.pid, args.keepAliveTrufflepig],
      webpack: [webpackProcess.pid],
      starSignal: [starSignalProcess.pid, args.keepAliveStarSignal],
      // wssProxy: [wssProxyProcess.pid, args.keepAliveWSS],
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
