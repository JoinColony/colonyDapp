const exec = require('child_process').exec;
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const findProcess = require('find-process');
const PATHS = require('./paths');

const { readdirSync, existsSync } = fs;
const { DAPP_MODULES, COMPONENTS_FOLDER, PID_FILE } = PATHS;


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

/**
 * Helper method to generate a specific webpack alias format entry object
 *
 * See the webpack alias format:
 * https://webpack.js.org/configuration/resolve/#resolve-alias
 *
 * @method generateWebpackAlias
 *
 * @param {string} moduleName Module name to generate the entry for
 * @param {string} searchPath The search path where the module can be found
 *
 * @return {Object} A new object with the alias entry
 */
const generateWebpackAlias = (
  moduleName,
  searchPath = DAPP_MODULES
) => ({
  [`~${moduleName}`]: path.resolve(
    searchPath,
    moduleName,
    COMPONENTS_FOLDER,
  ),
});

/**
 * Method to list all dapp module folders in a specific location.
 * The way this method interprets modules is:
 * - It must be a folder
 * - It must contain a `components` subfolder
 *
 * @NOTE We're using the syncronous version of `readdir` because this method
 * will ultimately be called from webpack's config export and we don't want
 * to screw with it's internal build process.
 *
 * @method getDappModules
 *
 * @param {string} searchPath Path to search for modules
 *
 * @return {Array<string>} An array of strings containing valid module names
 */
const getDappModules = (searchPath = DAPP_MODULES) => {
  const dappModules = readdirSync(searchPath);
  return dappModules.filter(
    dappModule => fs.existsSync(
      path.resolve(searchPath, dappModule, COMPONENTS_FOLDER),
    ),
  );
};

const getAllPids = () => {
  let pids;
  try {
    pids = require(PID_FILE);
  } catch (caughtError) {
    console.error(caughtError);
    return console.log('PID file not found. Please close the processes manually.');
  }
  return pids;
};

const getProcess = async processName => {
  const pids = getAllPids();
  if (!pids[processName]) {
    return null;
  }

  const [pid] = pids[processName];
  if (!pid) {
    return null;
  }
  const [process] = await findProcess('pid', parseInt(pid, 10)) || [];
  return process;
};

module.exports = {
  generateWebpackAlias,
  getAllPids,
  getDappModules,
  getProcess,
  shell,
};
