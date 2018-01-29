/* eslint-disable */

/*
 * Note:
 * This needs to run in the default node environment without the use of transpiler such as `babel`.
 * That's why we have to use `require()` calls and argument overwriting.
 */

const exec = require('child_process').exec;
const engines = require('../package').engines;

/**
 * Simple version check (logic check) to compare two values and exit if they're not equal.
 * If the strings are not equal, the process will exit with 1.
 *
 * @method checkVer
 *
 * @param {string} current A string of the current version number. Eg: 1.2.3
 * @param {string} required A string of the required version number. Eg: 1.2.3
 * @param {string} optionalPackage A optional name of the package being checked.
 */
const checkVer = (current, required, optionalPackage) => {
  optionalPackage = optionalPackage || 'package';
  if (current !== required) {
    console.log(`Your '${optionalPackage}' version of ${current} does not satisfy the required version of ${required}`);
    console.log('Exitting ...');
    process.exit(1);
  }
};

/**
 * Wrapper method for node's `child_process` `exec` to get the output of a shell command (using a callback)
 *
 * As with anything that touches the (priviledged) shell, BE CAREFUL, you are responsible for the commands you run!
 *
 * @method shell
 *
 * @param {string} command Shell command to execute
 * @param {Function} callback Callback fuction to pass the successfull output string to (trimmed of white space)
 */
const shell = (command, callback) => exec(command, (error, stdout) => {
  if (error) {
    console.log(`There was an error executing: '${command}'`);
    console.log('Exitting ...');
    process.exit(1);
  }
  return callback(stdout.trim());
});


/**
 * Check Node version
 * Check current running node version against the one declared inside `package.json`
 */

const node = {
  current: process.version.substring(1),
  required: `${engines.node}`,
};

checkVer(node.current, node.required, 'Node');

/**
 * Check Yarn's version
 * Check the current local one, versus the one specified in `package.json`
 */

const yarnRequired = `${engines.yarn}`;

shell('yarn --version', currentYarnVersion => checkVer(currentYarnVersion, yarnRequired, 'yarn'));
