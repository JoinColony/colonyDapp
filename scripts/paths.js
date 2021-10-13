const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..');

const MODULES_FOLDER = 'modules';
const COMPONENTS_FOLDER = 'components';
const NETWORK_FOLDER = 'colonyNetwork'

const NODE_ENV_OBJECT_PATH = 'process.env.';

const DAPP_ROOT = path.resolve(ROOT_PATH, 'src');
const DAPP_MODULES = path.resolve(DAPP_ROOT, MODULES_FOLDER);
const NETWORK_ROOT = path.resolve(DAPP_ROOT, 'lib', NETWORK_FOLDER);
const PID_FILE = path.resolve(ROOT_PATH, '.dappPids.json');

exports.MODULES_FOLDER = MODULES_FOLDER;
exports.COMPONENTS_FOLDER = COMPONENTS_FOLDER;
exports.DAPP_ROOT = DAPP_ROOT;
exports.DAPP_MODULES = DAPP_MODULES;
exports.NETWORK_ROOT = NETWORK_ROOT;
exports.PID_FILE = PID_FILE;

module.exports = {
  MODULES_FOLDER,
  COMPONENTS_FOLDER,
  DAPP_ROOT,
  DAPP_MODULES,
  NETWORK_ROOT,
  PID_FILE,
  NODE_ENV_OBJECT_PATH,
};
