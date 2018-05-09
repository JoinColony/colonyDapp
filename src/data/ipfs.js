/* @flow */
import IPFS from 'ipfs';
import { sleep } from '../utils/time';
import type { B58String, ColonyIPFSNode, ColonyIPFSOptions, IPFSNode, IPFSOptions, IPFSPeer, } from './types';

export { IPFS };


const DEFAULT_IPFS_SWARM = [];
const DEFAULT_BOOTSTRAP = [];
const DEFAULT_REPO = 'colonyIpfs';

export function makeOptions({ swarm = DEFAULT_IPFS_SWARM, bootstrap = DEFAULT_BOOTSTRAP, repo = DEFAULT_REPO }: ColonyIPFSOptions = {}): IPFSOptions {
  return {
    repo: repo,
    config: {
      Bootstrap: bootstrap,
      Addresses: {
        Gateway: "",
        Swarm: swarm,
      },
    },
    EXPERIMENTAL: {
      pubsub: true,
    },
    Discovery: {
      webRTCStar: {
        enabled: true
      }
    }
  };
}


/**
 * Turn a `swarm.peers()` result item into its B58 representation (Qm....)
 *
 * @param peerItem
 * @returns {string|*}
 */
function peerToB58String(peerItem: IPFSPeer): B58String {
  return peerItem.peer.id.toB58String();
}

/**
 * Get the peers swarm'd by this ipfs node.
 * Return a promise that'll resolve to undefined
 * (no peer found) or the list of peers.
 *
 * @param ipfs
 * @returns {Promise<*>}
 */
export async function getPeers(ipfs: IPFSNode): Promise<?IPFSPeer[]> {
  const peers: ?IPFSPeer[] = await ipfs.swarm.peers();

  if (peers && peers.length && peers.length > 0) {
    return peers;
  }

  return undefined;
}

/**
 * Wait until some peers have been detected.
 * Returns a promise that'll resolve into the list
 * of current peers.
 *
 * @param ipfs
 * @returns {Promise<*>}
 */
export async function waitForSomePeers(ipfs: IPFSNode): Promise<IPFSPeer[]> {
  let peers: ?IPFSPeer[] = await getPeers(ipfs);

  // TODO(laurent): in offline mode this would go into an infinite loop.
  while (!peers) {
    await sleep(500);
    peers = await getPeers(ipfs);
  }

  return peers;
}

/**
 * Wait until the peer identified by peerID (B58 string representation)
 * shows up.
 *
 * @param ipfs
 * @param peerID
 * @returns {Promise<boolean>}
 */
export async function waitForPeer(ipfs: IPFSNode, peerID: B58String): Promise<boolean> {
  let peers = await waitForSomePeers(ipfs);
  let peersB58 = peers.map(peerToB58String);

  while (peersB58.indexOf(peerID) < 0) {
    await sleep(500);
    peers = await waitForSomePeers(ipfs);
    peersB58 = peers.map(peerToB58String);
  }

  return true;
}

/**
 * Promise that returns the given node ID
 *
 * @param ipfs
 * @returns {Promise<any>} the node's B58 string id.
 */
export function getNodeID(ipfs: IPFSNode): Promise<B58String> {
  // TODO(laurent): type with error.

  return new Promise((resolve, reject) => {
    ipfs.id((err, n) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      else {
        resolve(n.id);
      }
    })
  })
}

type PromiseResolve<T> = (T) => void;

/**
 * Return a new IPFS object ready for use.
 *
 * The object has 3 more method:
 * - `ready`
 * - `waitForSomePeers`
 * - `waitForPeer`
 *
 * @param options
 * @returns {getIPFS|IPFS}
 */
export function getIPFS(options: IPFSOptions): ColonyIPFSNode {
  console.log('Get IPFS instance with:', options);

  const ipfs = new IPFS(options);

  let readyResolve: ?PromiseResolve<boolean> = null;
  let readyReject: ?PromiseResolve<Error> = null;

  const isReady = new Promise((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });

  ipfs.on('ready', () => {
    console.log('IPFS is ready...');

    // Reassure flow type
    if (!readyResolve) {
      throw new Error("Colony's IPFS is not ready");
    }

    readyResolve(true);
  });

  ipfs.on('error', e => {
    console.error('IPFS failed to start: ', e);

    // Reassure flow type
    if (!readyReject) {
      throw new Error("Colony's IPFS is not ready");
    }
    readyReject(e);
  });

  ipfs.ready = () => isReady;
  ipfs.waitForSomePeers = () => waitForSomePeers(ipfs);
  ipfs.waitForPeer = peerID => waitForPeer(ipfs, peerID);

  return ipfs;
}
