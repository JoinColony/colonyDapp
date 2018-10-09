/* @flow */

import IPFS from 'ipfs';
import { promisify } from 'es6-promisify';

import { sleep } from '../../utils/time';

import type { IPFSNodeOptions, B58String, IPFSPeer } from './types';

class IPFSNode {
  static DEFAULT_OPTIONS = {
    ipfs: {
      repo: 'colonyIpfs',
      config: {
        Bootstrap: [],
        Addresses: {
          Gateway: '',
          Swarm: [],
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
    timeout: 10000,
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
   * Promise that returns the given node ID
   */
  getNodeID(): Promise<B58String> {
    return promisify(this._ipfs.id.bind(this._ipfs))().then(node => node.id);
  }
}

export default IPFSNode;
