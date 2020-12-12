#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');
const fs = require('fs');
const args = require('minimist')(process.argv);
const chalk = require('chalk');
var sudo = require('sudo-prompt');
const fetchRetry = require('@adobe/node-fetch-retry');

const startGanache = require('./start_ganache');
const deployContracts = require('./deploy_contracts');
const setupGraphNode = require('./setup_graph_node');

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

/*
 * For all future readers of this file:
 * This is not the actual oracle from the colonyNetwork, this is just a mocked
 * version that we use for testing reputation queries locally
 */
addProcess('oracle', async () => {
  const mockOracleProcess = spawn('npm', ['start'], {
    cwd: path.resolve(__dirname, '..', 'src/lib/mock-oracle'),
    stdio: 'pipe',
  });
  if (args.foreground) {
    mockOracleProcess.stdout.pipe(process.stdout);
    mockOracleProcess.stderr.pipe(process.stderr);
  }
  mockOracleProcess.on('error', e => {
    mockOracleProcess.kill();
    reject(e);
  });
  await waitOn({ resources: ['tcp:3001'] });
  return mockOracleProcess;
});

addProcess('db', async () => {
  const dbProcess = spawn('npm', ['run', 'db:start'], {
    cwd: path.resolve(__dirname, '..', 'src/lib/colonyServer'),
    stdio: 'pipe',
  });
  if (args.foreground) {
    dbProcess.stdout.pipe(process.stdout);
    dbProcess.stderr.pipe(process.stderr);
  }
  dbProcess.on('error', e => {
    console.error(e);
    dbProcess.kill();
  });
  await waitOn({ resources: ['tcp:27018'] });
  const cleanProcess = spawn('npm', ['run', 'db:clean'], {
    cwd: path.resolve(__dirname, '..', 'src/lib/colonyServer'),
    stdio: 'pipe',
  });
  if (args.foreground) {
    cleanProcess.stdout.pipe(process.stdout);
    cleanProcess.stderr.pipe(process.stderr);
  }
  await new Promise((resolve, reject) => {
    cleanProcess.on('exit', cleanCode => {
      if (cleanCode) {
        dbProcess.kill();
        return reject(new Error(`Clean process exited with code ${cleanCode}`));
      }
      const setupProcess = spawn('npm', ['run', 'db:setup'], {
        cwd: path.resolve(__dirname, '..', 'src/lib/colonyServer'),
      });
      setupProcess.on('exit', setupCode => {
        if (setupCode) {
          dbProcess.kill();
          return reject(new Error(`Setup process exited with code ${setupCode}`));
        }
        resolve();
      });
    });
  });
  return dbProcess;
});

addProcess('server', async () => {
  const serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.resolve(__dirname, '..', 'src/lib/colonyServer'),
    stdio: 'pipe',
  });
  if (args.foreground) {
    serverProcess.stdout.pipe(process.stdout);
    serverProcess.stderr.pipe(process.stderr);
  }
  serverProcess.on('error', e => {
    serverProcess.kill();
    reject(e);
  });
  await waitOn({ resources: ['tcp:3000'] });
  return serverProcess;
});

addProcess('graph-node', async () => {
  await new Promise(resolve => {
    console.log(); // New line
    console.log('Cleaning up the old graph-node docker data folder. For this we need', chalk.bold.red('ROOT'), 'permissions');
    sudo.exec(`rm -Rf ${path.resolve(__dirname, '..', 'src/lib/graph-node/docker/data')}`, {},
      function (error, stdout, stderr) {
        if (error) throw error;
        console.log('stdout: ' + stdout);
        resolve();
      }
    );
  })
  await new Promise((resolve, reject) => {
    const setupProcess = spawn('node', ['./setup_graph_node.js'], {
      cwd: path.resolve(__dirname),
    });

    console.log(); // New line
    console.log('Setting up docker-compose with the local environment ...');

    if (args.foreground) {
      setupProcess.stdout.pipe(process.stdout);
      setupProcess.stderr.pipe(process.stderr);
    }

    setupProcess.on('exit', errorCode => {
      if (errorCode) {
        return reject(new Error(`Setup process exited with code ${errorCode}`));
      }
      resolve();
    });
  });

  const graphNodeProcess = spawn('docker-compose', ['up'], {
    cwd: path.resolve(__dirname, '..', 'src/lib/graph-node/docker'),
  });

  if (args.foreground) {
    graphNodeProcess.stdout.pipe(process.stdout);
    graphNodeProcess.stderr.pipe(process.stderr);
  }

  graphNodeProcess.on('error', e => {
    graphNodeProcess.kill();
    reject(e);
  });

  return graphNodeProcess;
});

addProcess('subgraph', async () => {

  /*
   * Wait for the
   */
  await fetchRetry('http://localhost:8000', {
    retryOptions: {
      /*
       * Max try time of 5 minutes
       * If it's not up by now we should just give up...
       */
      retryMaxDuration: 300000,  // 5m retry max duration
      /*
       * Wait a second before retrying
       */
      retryInitialDelay: 5000,
      /*
       * Don't backoff, just keep hammering
       */
      retryBackoff: 1.0
    }
  });

  await new Promise((resolve, reject) => {
    const codeGenProcess = spawn('npm', ['run', 'codegen'], {
      cwd: path.resolve(__dirname, '..', 'src/lib/subgraph'),
    });

    console.log(); // New line
    console.log('Generating subgraph types and schema ...');

    if (args.foreground) {
      codeGenProcess.stdout.pipe(process.stdout);
      codeGenProcess.stderr.pipe(process.stderr);
    }

    codeGenProcess.on('exit', errorCode => {
      if (errorCode) {
        return reject(new Error(`Codegen process exited with code ${errorCode}`));
      }
      resolve();
    });
  });

  await new Promise((resolve, reject) => {
    const createLocalProcess = spawn('npm', ['run', 'create-local'], {
      cwd: path.resolve(__dirname, '..', 'src/lib/subgraph'),
    });

    console.log(); // New line
    console.log('Creating a local subgraph instance ...');

    if (args.foreground) {
      createLocalProcess.stdout.pipe(process.stdout);
      createLocalProcess.stderr.pipe(process.stderr);
    }

    createLocalProcess.on('exit', errorCode => {
      if (errorCode) {
        return reject(new Error(`Create local process exited with code ${errorCode}`));
      }
      resolve();
    });
  });

  const deployLocalProcess = spawn('npm', ['run', 'deploy-local'], {
    cwd: path.resolve(__dirname, '..', 'src/lib/subgraph'),
  });

  console.log(); // New line
  console.log('Deploying the local subgraph instance ...');

  if (args.foreground) {
    deployLocalProcess.stdout.pipe(process.stdout);
    deployLocalProcess.stderr.pipe(process.stderr);
  }

  deployLocalProcess.on('error', error => {
    deployLocalProcess.kill();
    reject(error);
  });

  return deployLocalProcess;
});

addProcess('webpack', () =>
  new Promise((resolve, reject) => {
    let webpackArgs = ['run', 'webpack'];
    const webpackProcess = spawn('npm', webpackArgs, {
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
  })
);

const pids = {};
const startAll = async () => {
  const startSerial = processes.reduce((promise, process) => {
    if (`skip-${process.name}` in args) {
      console.info(chalk.yellow(`Skipping ${process.name}`));
      return promise;
    };
    return promise
      .then(() => {
        console.log(); // New line before logging the process start
        console.info(chalk.bold.green(`Starting ${process.name}...`));
        return process.startFn();
      })
      .then(proc => {
        pids[process.name] = proc.pid;
        fs.writeFileSync(PID_FILE, JSON.stringify(pids));
      });
  }, Promise.resolve(true));

  try {
    await startSerial;
  } catch (caughtError) {
    console.info(chalk.redBright('Stack start failed.'));
    console.info(chalk.redBright(caughtError.message));
    process.exit(1);
  }

  console.log(); // New line
  console.info(chalk.bold.green('Stack started successfully.'));
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
