const chalk = require('chalk');
const path = require('path');
const os = require('os');
const { exec } = require("child_process");
const fs = require('fs');
const yaml = require('js-yaml');

const LIB_PATH = path.resolve(__dirname, '..', 'src/lib');
const GRAPH_NODE_DOCKER_PATH = `${LIB_PATH}/graph-node/docker`;
const DOCKER_COMPOSE_CONFIG = 'docker-compose.yml';

try {
  /*
   * Read the docker compose yaml config
   */
  const dockerComposeConfig = yaml.safeLoad(
    fs.readFileSync(
      `${GRAPH_NODE_DOCKER_PATH}/${DOCKER_COMPOSE_CONFIG}`,
      'utf8',
    ),
  );
  /*
   * Get the local network interface ip address
   */
  const networkInterfaces = os.networkInterfaces();
  const localNetworkInterfaces = [];
  Object.keys(networkInterfaces).map(inteface => networkInterfaces[inteface].map(({ internal, family, address }) => {
    if (!internal && family === 'IPv4') {
      localNetworkInterfaces.push(address);
    }
  }));
  /*
   * Write the docker config object values
   */
  dockerComposeConfig.services['graph-node'].extra_hosts = [`host.docker.internal:${localNetworkInterfaces.join(':')}`];
  /*
   * Write the docker compose yaml back
   */
  fs.writeFileSync(`${GRAPH_NODE_DOCKER_PATH}/${DOCKER_COMPOSE_CONFIG}`, yaml.safeDump(dockerComposeConfig), { encoding: 'utf8'});
} catch (e) {
  console.log(e);
}

console.log();
console.info('Removing docker compose \'data\' folder. We need', chalk.bold.red('ROOT'), 'permissions to accomplish this.');
exec('sudo rm -r ./data', { cwd: GRAPH_NODE_DOCKER_PATH })

