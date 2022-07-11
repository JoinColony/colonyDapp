const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..');

const MODULES_FOLDER = 'modules';
const LIB_FOLDER = 'lib';
const COMPONENTS_FOLDER = 'components';
const NETWORK_FOLDER = 'colonyNetwork';
const NETWORK_PACKAGES_FOLDER = 'packages';

const NODE_ENV_OBJECT_PATH = 'process.env.';

const DAPP_ROOT = path.resolve(ROOT_PATH, 'src');
const DAPP_MODULES = path.resolve(DAPP_ROOT, MODULES_FOLDER);
const DAPP_LIBS = path.resolve(DAPP_ROOT, LIB_FOLDER);
const NETWORK_ROOT = path.resolve(DAPP_LIBS, NETWORK_FOLDER);
const NETWORK_PACKAGES = path.resolve(NETWORK_ROOT, NETWORK_PACKAGES_FOLDER);
const PID_FILE = path.resolve(ROOT_PATH, '.dappPids.json');
const GANACHE_ACCOUNTS = path.resolve(NETWORK_ROOT, 'ganache-accounts.json');
const ETHERROUTER_ADDRESS = path.resolve(NETWORK_ROOT, 'etherrouter-address.json');

exports.MODULES_FOLDER = MODULES_FOLDER;
exports.COMPONENTS_FOLDER = COMPONENTS_FOLDER;
exports.LIB_FOLDER = LIB_FOLDER;

exports.DAPP_ROOT = DAPP_ROOT;
exports.DAPP_MODULES = DAPP_MODULES;
exports.DAPP_LIBS = DAPP_LIBS;
exports.NETWORK_ROOT = NETWORK_ROOT;
exports.NETWORK_PACKAGES = NETWORK_PACKAGES;
exports.PID_FILE = PID_FILE;
exports.GANACHE_ACCOUNTS = GANACHE_ACCOUNTS;
exports.ETHERROUTER_ADDRESS = ETHERROUTER_ADDRESS;

module.exports = {
  MODULES_FOLDER,
  COMPONENTS_FOLDER,
  LIB_FOLDER,
  DAPP_ROOT,
  DAPP_MODULES,
  DAPP_LIBS,
  NETWORK_ROOT,
  NETWORK_PACKAGES,
  PID_FILE,
  NODE_ENV_OBJECT_PATH,
  GANACHE_ACCOUNTS,
  ETHERROUTER_ADDRESS,
};
