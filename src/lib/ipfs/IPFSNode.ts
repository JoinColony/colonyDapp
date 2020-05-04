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
  static getIpfsConfig = configMap[NETWORK];

  _ipfs: IPFS;

  ready: Promise<boolean>;

  constructor() {
    const promise = IPFS.create(IPFSNode.getIpfsConfig()).then(ipfs => {
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
    const result = await this._ipfs.cat(hash);
    if (!result) throw new Error('No such file');
    return result.toString();
  }

  /** Upload a string */
  async addString(data: string): Promise<string> {
    await this.ready;
    const [result] = await this._ipfs.add(IPFS.Buffer.from(data));
    return result.path;
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
