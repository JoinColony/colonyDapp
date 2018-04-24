const exec = require('child_process').exec;
const chalk = require('chalk');

/**
 * Wrapper method for node's `child_process` `exec` to get the live output of a shell command.
 * This is an updated version from the one
 *
 * As with anything that touches the (priviledged) shell, BE CAREFUL, you are responsible for the commands you run!
 *
 * @method shell
 *
 * @param {string} command Shell command to execute
 * @param {function} callback Optional callback fuction to pass the successfull output string to
 * @param {boolean} setColor True by default, used to pass the `--color` argument to the `command`
 */
const shell = (
  command,
  callback,
  setColor = true
) =>
exec(`${command}${setColor ? ' --color': ''}`, (error, stdout) => {
  if (error) {
    console.log(chalk.red(`There was an error executing: '${command}'`));
    console.log(error);
    console.log('Exitting ...');
    process.exit(1);
  }
  if (callback && typeof callback === 'function') {
    return callback(stdout);
  }
  return undefined;
}).stdout.on('data',output => process.stdout.write(output));

module.exports = {
  shell,
}
