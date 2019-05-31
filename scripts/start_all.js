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

const processes = [];

const addProcess = (name, startFn) => {
  processes.push({ name, startFn });
};

addProcess('ganache', startGanache);

addProcess('truffle', () =>
  new Promise((resolve, reject) => {
    const contractProcess = deployContracts();
    contractProcess.on(
      'exit',
      code =>
        code ? reject(new Error('Contract deployment failed')) : resolve(contractProcess),
    );
    contractProcess.on('error', reject);
  })
);

addProcess('trufflepig', () =>
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
  })
);

addProcess('ipfsd', () =>
  new Promise((resolve, reject) => {
    const ipfsdProcess = spawn('yarn', ['ipfsd-go'], {
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
      webpackProcess.kill();
      reject(e);
    });
  })
);

addProcess('pinion', () => 
  new Promise((resolve, reject) => {
    const pinionProcess = spawn('yarn', ['start'], {
      cwd: path.resolve(__dirname, '..', 'src/lib/pinion'),
      stdio: 'pipe',
      env: {
        ...process.env,
        PINION_ROOM: 'PINION_DEV_ROOM',
      },
    });
    // Wait a few seconds for pinion to settle in
    setTimeout(() => resolve(pinionProcess), 4000);
    if (args.foreground) {
      pinionProcess.stdout.pipe(process.stdout);
      pinionProcess.stderr.pipe(process.stderr);
    }
    pinionProcess.on('error', e => {
      pinionProcess.kill();
      reject(e);
    });
  })
);

addProcess('wss', async () => {
  const wssProxyProcess = spawn(
    path.resolve(__dirname, './start_wss_proxy.js'),
    {
      stdio: 'pipe',
    },
  );
  await waitOn({ resources: ['tcp:4004'] });
  return wssProxyProcess;
});

addProcess('star', startStarSignal);

addProcess('webpack', () =>
  new Promise((resolve, reject) => {
    const webpackProcess = spawn('yarn', ['run', 'webpack'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'pipe',
    });
    setTimeout(() => console.info('Reticulating splines...'), 3000);
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
  })
);


const startAll = async () => {
  const pids = {};

  const startSerial = processes.reduce((promise, process) => {
    if (`skip-${process.name}` in args) return promise;
    return promise
      .then(() => {
        console.info(`Starting ${process.name}...`);
        return process.startFn();
      })
      .then(proc => {
        pids[process.name] = proc.pid;
      });
  }, Promise.resolve(true));

  try {
    await startSerial;
  } catch (caughtError) {
    console.info(chalk.redBright('Stack start failed.'));
    console.info(chalk.redBright(caughtError.message));
    process.exit(1);
  }
  
  fs.writeFileSync(PID_FILE, JSON.stringify(pids));
  
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
