const { spawn } = require('child_process');
const path = require('path');
const args = require('minimist')(process.argv);
const cypress = require('cypress');
const kill  = require('tree-kill');

const webpackDevServer = () => new Promise((resolve, reject) => {

  const webpackProcess = spawn('yarn', ['webpack'], {
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

webpackDevServer().then(
  webpackProcess =>
    cypress.run().then(
      () =>
        kill(webpackProcess.pid),
    ),
);
