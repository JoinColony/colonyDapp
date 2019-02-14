const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..');

const COMPONENTS_FOLDER = 'components';
const NETWORK_FOLDER = 'colonyNetwork';

const DAPP_ROOT = path.resolve(ROOT_PATH, 'src');
const NETWORK_ROOT = path.resolve(DAPP_ROOT, 'lib', NETWORK_FOLDER);
const PID_FILE = path.resolve(ROOT_PATH, '.dappPids.json');

exports.COMPONENTS_FOLDER = COMPONENTS_FOLDER;
exports.DAPP_ROOT = DAPP_ROOT;
exports.NETWORK_ROOT = NETWORK_ROOT;
exports.PID_FILE = PID_FILE;

module.exports = {
  COMPONENTS_FOLDER,
  DAPP_ROOT,
  NETWORK_ROOT,
  PID_FILE,
};
