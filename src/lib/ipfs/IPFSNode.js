/* @flow */

import IPFS from 'ipfs';
import { promisify } from 'es6-promisify';

import { sleep } from '../../utils/time';

import type { IPFSNodeOptions, B58String, IPFSPeer } from './types';

const TIMEOUT = process.env.CI ? 50000 : 10000;

class IPFSNode {
  static DEFAULT_OPTIONS = {
    ipfs: {
      repo: 'colonyIpfs',
      config: {
        Bootstrap: [],
        Addresses: {
          Gateway: '',
          Swarm: [
            '/ip4/0.0.0.0/tcp/4002',
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          ],
        },
      },
      EXPERIMENTAL: {
        pubsub: true,
      },
      Discovery: {
        webRTCStar: {
          enabled: true,
        },
      },
    },
    timeout: TIMEOUT,
  };

  /**
   * Turn a `swarm.peers()` result item into its B58 representation (Qm....)
   */
  static peerToB58String = (peerItem: IPFSPeer): B58String =>
    peerItem.peer.id.toB58String();

  _ipfs: IPFS;

  ready: Promise<boolean>;

  constructor(
    { ipfs: ipfsOptions, timeout }: IPFSNodeOptions = this.constructor
      .DEFAULT_OPTIONS,
  ) {
    this._ipfs = new IPFS(ipfsOptions);
    this.ready = new Promise((resolve, reject) => {
      // Check whether IPFS is already connected?
      if (this._ipfs.isOnline()) {
        resolve(true);
        return;
      }
      const connectTimeout = setTimeout(() => {
        reject(new Error('IPFS connection timed out.'));
      }, timeout);
      this._ipfs.on('ready', () => {
        clearTimeout(connectTimeout);
        resolve(true);
      });
      this._ipfs.on('error', err => {
        clearTimeout(connectTimeout);
        reject(err);
      });
    });
  }

  /**
   * Get the IPFS instance (to use in 3rd party libraries (e.g. orbit-db))
   */
  getIPFS() {
    return this._ipfs;
  }

  /**
   * Get the peers swarm'd by this ipfs node.
   * Return a promise that'll resolve to undefined
   * (no peer found) or the list of peers.
   */
  async getPeers(): Promise<?(IPFSPeer[])> {
    const peers: ?(IPFSPeer[]) = await this._ipfs.swarm.peers();

    if (peers && peers.length && peers.length > 0) {
      return peers;
    }

    return null;
  }

  /**
   * Wait until some peers have been detected.
   * Returns a promise that'll resolve into the list
   * of current peers.
   */
  async waitForSomePeers(): Promise<IPFSPeer[]> {
    let peers: ?(IPFSPeer[]) = await this.getPeers();

    // TODO: in offline mode this would go into an infinite loop.
    while (!peers || !peers.length) {
      /* eslint-disable no-await-in-loop */
      await sleep(500);
      peers = await this.getPeers();
      /* eslint-enable no-await-in-loop */
    }

    return peers;
  }

  /**
   * Wait until the peer identified by peerID (B58 string representation)
   * shows up.
   */
  async waitForPeer(peerID: B58String): Promise<boolean> {
    let peers = await this.waitForSomePeers();
    let peersB58 = peers.map(this.constructor.peerToB58String);

    while (peersB58.indexOf(peerID) < 0) {
      /* eslint-disable no-await-in-loop */
      await sleep(500);
      peers = await this.waitForSomePeers();
      peersB58 = peers.map(this.constructor.peerToB58String);
      /* eslint-enable no-await-in-loop */
    }

    return true;
  }

  /**
   * Return a file from IPFS as text
   */
  async getString(hash: string): Promise<string> {
    await this.ready;
    const result = await this._ipfs.files.cat(hash);
    if (!result) throw new Error('No such file');
    return result.toString();
  }

  /**
   * Upload a string
   * @return hash of the uploaded string
   */
  async addString(data: string): Promise<string> {
    await this.ready;
    const results = await this._ipfs.files.add(
      this._ipfs.types.Buffer.from(data),
    );
    if (!results.length) throw new Error('Failed to upload to IPFS');
    return results[0].path;
  }

  /**
   * Promise that returns the given node ID
   */
  getNodeID(): Promise<B58String> {
    return promisify(this._ipfs.id.bind(this._ipfs))().then(node => node.id);
  }

  /** Start the connection to IPFS (if not connected already) */
  start(): Promise<void> {
    return this._ipfs.start();
  }

  /** Stop the connection to IPFS */
  stop(): Promise<void> {
    return this._ipfs.stop();
  }
}

export default IPFSNode;
