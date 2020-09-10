import IPFS from 'ipfs';

import devConfig from './ipfsConfig.development';
import prodConfig from './ipfsConfig.production';
import qaConfig from './ipfsConfig.qa';

const NETWORK = process.env.NETWORK || 'local';

const configMap = {
  mainnet: prodConfig,
  local: devConfig,
  goerli: qaConfig,
};

class IPFSNode {
  static getIpfsConfig = configMap[NETWORK] || configMap['mainnet'];

  _ipfs: IPFS;

  ready: Promise<boolean>;

  constructor() {
    const promise = IPFS.create(IPFSNode.getIpfsConfig()).then((ipfs) => {
      this._ipfs = ipfs;
    });
    this.ready = promise.then(() => true);
  }

  /** Get the IPFS instance */
  getIPFS() {
    return this._ipfs;
  }

  /** Return a file from IPFS as text */
  async getString(hash: string): Promise<string> {
    if (!hash) return '';
    await this.ready;
    const resultIterator = await this._ipfs.cat(hash);
    const { value } = await resultIterator.next();
    if (!value) throw new Error('No such file');
    return value.toString();
  }

  /** Upload a string */
  async addString(data: string): Promise<string> {
    await this.ready;
    const resultIterator = await this._ipfs.add(data);
    const {
      value: { path },
    } = await resultIterator.next();
    return path;
  }

  /** Start the connection to IPFS (if not connected already) */
  start(): Promise<void> {
    return this._ipfs.start();
  }

  /** Stop the connection to IPFS */
  async stop(): Promise<void> {
    return this._ipfs.stop();
  }
}

export default IPFSNode;
