const exec = require('child_process').exec;
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const PATHS = require('./paths');

const { readdirSync, existsSync } = fs;
const { DAPP_MODULES, COMPONENTS_FOLDER } = PATHS;


/**
 * Wrapper method for node's `child_process` `exec` to get the live output of a shell command.
 * This is an updated version from the one
 *
 * As with anything that touches the (priviledged) shell, BE CAREFUL, you are responsible for the commands you run!
 *
 * @method shell
 *
 * @param {string} command Shell command to execute
 * @param {object} options Optional options to pass down to the `exec()` method
 * @param {function} callback Optional callback fuction to pass the successfull output string to
 */
const shell = (
  command,
  options = {},
  callback,
) => {
  const runner = exec(command, options, (error, stdout) => {
    if (error) {
      console.log(chalk.red(`There was an error executing: '${command}'`));
      console.log(error);
      console.log('Exitting ...');
      process.exit(1);
    }
  });
  runner.stdout.on('data', output => process.stdout.write(output));
  runner.on('exit', () => {
    if (callback && typeof callback === 'function') {
      return callback();
    }
    return undefined;
  });
  return runner;
};

const generateWebpackAlias = (
  moduleName,
  searchPath = DAPP_MODULES
) => ({
  [`~${moduleName}`]: path.resolve(
    searchPath,
    moduleName,
    'components',
  ),
});

const getDappModules = (searchPath = DAPP_MODULES) => {
  /*
   * @NOTE We're using the syncronous version of `readdir` because this method
   * will ultimately be called from webpack's config export and we don't want
   * to screw with it's internal build process.
   */
  const dappModules = readdirSync(searchPath);
  return dappModules.filter(
    dappModule => fs.existsSync(
      path.resolve(searchPath, dappModule, COMPONENTS_FOLDER),
    ),
  );
};

module.exports = {
  shell,
  generateWebpackAlias,
  getDappModules,
};
