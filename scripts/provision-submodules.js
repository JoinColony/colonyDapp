const shell = require('./utils').shell;
const chalk = require('chalk');
const path = require('path');

const libPath = path.resolve('.', 'src', 'lib');
const clientPath = path.resolve(libPath, 'colony-js');
const walletPath = path.resolve(libPath, 'colony-wallet');
const networkPath = path.resolve(libPath, 'colonyNetwork');

/*
 * Cleanup submodule folders
 */
const cleanup = async () => {
  console.log(chalk.green.bold('Cleaning up submodule folders'));
  await shell(`rm -Rf ${clientPath} ${walletPath} ${networkPath}`);
}

/*
 * Update / re-pull submodules
 */
const update = async () => {
  console.log(chalk.green.bold('Initialize submodule libs'));
  await shell('git -c color.status=always submodule update --init --recursive', {}, build);
}

/*
 * Build submodules
 */
const build = async () => {
  console.log(chalk.green.bold('Building submodules'));
  /* colony-js */
  await shell('yarn --color && lerna run build --color', { cwd: clientPath });
  /* colony-wallet */
  await shell('yarn --color && yarn build:dev --color', { cwd: walletPath });
  /* colonyNetwork */
  await shell('yarn --color && git -c color.status=always submodule update --init', { cwd: networkPath });
}

cleanup();

update();
