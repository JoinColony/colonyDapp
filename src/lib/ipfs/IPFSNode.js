/* @flow */

import IPFS from 'ipfs';

import { sleep } from '../../utils/time';
import { isDev } from '../../utils/debug';

import type { IPFSNodeOptions, B58String, IPFSPeer } from './types';
import PinnerConnector from './PinnerConnector';

const PINNING_ROOM = process.env.PINNING_ROOM || 'COLONY_PINNING_ROOM';
const { PINNER_ID } = process.env;

const TIMEOUT = process.env.CI ? 50000 : 10000;

const DEV_CONFIG = {
  Bootstrap: [
    // This is the connection to the dev ipfs daemon
    /* eslint-disable max-len */
    '/ip4/127.0.0.1/tcp/4001/ipfs/QmQBF89g7VHjcQVNGEf5jKZnU5r6J8G2vfHzBpivKqgxs6',
    '/ip4/127.0.0.1/tcp/4004/wss/ipfs/QmQBF89g7VHjcQVNGEf5jKZnU5r6J8G2vfHzBpivKqgxs6',
    /* eslint-enable max-len */
  ],
  Addresses: {
    Gateway: '',
    Swarm: [],
  },
};

const PROD_CONFIG = {
  Bootstrap: [
    /* eslint-disable max-len */
    // TODO: Add our pinning service node here
    '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
    '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
    '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
    '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
    '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
    '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
    '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
    '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
    /* eslint-enable max-len */
  ],
  Addresses: {
    Swarm: [
      // TODO: use our own star server
      // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
    ],
  },
};

class IPFSNode {
  static DEFAULT_OPTIONS = {
    ipfs: {
      repo: 'colonyIpfs',
      config: {
        Bootstrap: isDev ? DEV_CONFIG.Bootstrap : PROD_CONFIG.Bootstrap,
        Addresses: isDev ? DEV_CONFIG.Addresses : PROD_CONFIG.Addresses,
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

  pinner: PinnerConnector;

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

  async connectPinner() {
    await this.ready;
    this.pinner = new PinnerConnector(this.getIPFS(), PINNING_ROOM, PINNER_ID);
    await this.pinner.init();
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
    const result = await this._ipfs.cat(hash);
    if (!result) throw new Error('No such file');
    return result.toString();
  }

  /**
   * Upload a string
   * @return hash of the uploaded string
   */
  async addString(data: string): Promise<string> {
    await this.ready;
    const [result] = await this._ipfs.add(this._ipfs.types.Buffer.from(data));
    if (!result) throw new Error('Failed to upload to IPFS');
    if (this.pinner) {
      this.pinner.pinHash(result.hash);
    }
    return result.path;
  }

  /**
   * Promise that returns the given node ID
   */
  async getNodeID(): Promise<B58String> {
    const { id } = await this._ipfs.id();
    return id;
  }

  /** Start the connection to IPFS (if not connected already) */
  start(): Promise<void> {
    return this._ipfs.start();
  }

  /** Stop the connection to IPFS */
  async stop(): Promise<void> {
    if (this.pinner) {
      await this.pinner.disconnect();
    }
    return this._ipfs.stop();
  }
}

export default IPFSNode;
