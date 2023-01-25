const path = require('path');
const os = require('os');
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
  Object.keys(networkInterfaces).map(interface => networkInterfaces[interface].map(({ internal, family, address }) => {
    if (!internal && family === 'IPv4') {
      localNetworkInterfaces.push(address);
    }
  }));
  /*
   * Write the docker config object values
   */
  dockerComposeConfig.services['graph-node'].environment.ethereum = `mainnet:http://${localNetworkInterfaces[0]}:8545`;
  /*
   * Write the docker compose yaml back
   */
  fs.writeFileSync(`${GRAPH_NODE_DOCKER_PATH}/${DOCKER_COMPOSE_CONFIG}`, yaml.safeDump(dockerComposeConfig), { encoding: 'utf8' });
} catch (error) {

  console.error(error);

}
