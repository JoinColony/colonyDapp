const path = require('path');
const fs = require('fs');
const PATHS = require('./paths');
const Dotenv = require('dotenv-webpack');

const { readdirSync } = fs;
const { DAPP_MODULES, COMPONENTS_FOLDER, NODE_ENV_OBJECT_PATH } = PATHS;
const envs = new Dotenv({
  systemvars: !!process.env.CI || !!process.env.DEV,
});

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

/*
 * Returns an array of resource key paris (endspoints, urls, sockets) based
 * on an input process name (process names corespond to the pid names from
 * the start-all script)
 *
 * Would be nice if this would generate these values dynamically, but that's
 * alot of time we can't afford right now to sink into this.
 */
const getStaticDevResource = (processName) => {
  switch (processName) {
    case 'ganache': {
      return [
        { desc: 'Ganache RPC Endpoint', res: 'http://0.0.0.0:8545' },
        { desc: 'Ganache Accounts Key File', res: 'src/lib/colonyNetwork/ganache-accounts.json' },
      ];
    }
    case 'truffle': {
      return [
        { desc: 'Currently Deployed EtherRouter Address:', res: 'src/lib/colonyNetwork/etherrouter-address.json' },
      ];
    }
    case 'oracle': {
      return [
        { desc: 'Mock Oracle API Endpoint', res: 'http://0.0.0.0:3001' },
      ];
    }
    case 'db': {
      return [
        { desc: 'MongoDB Server', res: 'mongodb://localhost:27018' },
        { desc: 'MongoDB Database name', res: 'colonyServer' },
      ];
    }
    case 'server': {
      return [
        { desc: 'Colony Server GraphQL Playground', res: 'http://0.0.0.0:3000/graphql' },
      ];
    }
    case 'graph-node': {
      return [
        { desc: 'Postgres Server', res: 'postgres://0.0.0.0:5432' },
        { desc: 'Postgres Database name', res: 'graph-node' },
        { desc: 'IPFS Gateway WebUI', res: 'http://0.0.0.0:5001/webui' },
        { desc: 'Colony Subgraph GraphQL Playground', res: 'http://0.0.0.0:8000/subgraphs/name/joinColony/subgraph/graphql' },
        { desc: 'The Graph Subgraph Metrics', res: 'http://0.0.0.0:8040' },
      ];
    }
    case 'webpack': {
      return [
        { desc: 'Colony Dapp', res: 'http://0.0.0.0:9090' },
      ];
    }
    default: {
      return [];
    }
  }
};

/*
 * Load variables declared inside the `.env` file and inject them into `process.env`.
 * This util is to be used in places outside of the `webpack` loader since it will
 * loaded the environemnt variables itself. A good place to use this is the `start_all`
 * script since that is the one that orchestrates everything.
 *
 * If a `filter` argument is provided, only that environment variable will be loaded
 */
const injectEnvironmentVariables = (filter) => {
  const hasFilter = !!filter && typeof filter === 'string';
  if (hasFilter) {
    const value = envs.definitions[`${NODE_ENV_OBJECT_PATH}${filter}`]?.replace(/\"/g, '');
    process.env[filter] = !value ? '' : value;
  } else {
    Object.keys(envs.definitions)?.map(varFullLabel => {
      const varLabel = varFullLabel?.replace(NODE_ENV_OBJECT_PATH, '');
      const value = envs.definitions[`${NODE_ENV_OBJECT_PATH}${varLabel}`]?.replace(/\"/g, '');
      process.env[varLabel] = !value ? '' : value;
    });
  }
};

module.exports = {
  generateWebpackAlias,
  getDappModules,
  getStaticDevResource,
  injectEnvironmentVariables,
};
