const chalk = require('chalk');
const path = require('path');
const os = require('os');
const { exec } = require("child_process");

const LIB_PATH = path.resolve(__dirname, '..', 'src/lib');
const GRAPH_NODE_PATH = `${LIB_PATH}/graph-node`;
const DOCKER_COMPOSE_CONFIG = 'docker-compose.yml';

if (os.platform() === 'linux') {
  console.log();
  console.info('Looks like we\'re running on Linux, we have to modify the', chalk.bold.yellow('docker-compose.yml'), 'file for this work.');
  exec(`git checkout ${DOCKER_COMPOSE_CONFIG}`, { cwd: GRAPH_NODE_PATH });
  exec('bash ./setup', { cwd: GRAPH_NODE_PATH });
}

console.log();
console.info('Removing docker compose \'data\' folder. We need', chalk.bold.red('ROOT'), 'permissions to accomplish this.');
exec('sudo rm -r ./docker/data', { cwd: GRAPH_NODE_PATH })
