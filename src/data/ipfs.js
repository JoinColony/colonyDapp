/* @flow */
import IPFS from 'ipfs';

export { IPFS };

const DEFAULT_IPFS_SWARM = [];
const DEFAULT_BOOTSTRAP = [];
const DEFAULT_REPO = 'colonyIpfs';

export function makeOptions({ swarm = DEFAULT_IPFS_SWARM, bootstrap = DEFAULT_BOOTSTRAP, repo = DEFAULT_REPO } = {}) {
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

// https://stackoverflow.com/a/39914235
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Turn a `swarm.peers()` result item into its B58 representation (Qm....)
 *
 * @param peerItem
 * @returns {string|*}
 */
const peerToB58String = peerItem => peerItem.peer.id.toB58String()

/**
 * Get the peers swarm'd by this ipfs node.
 * Return a promise that'll resolve to undefined
 * (no peer found) or the list of peers.
 *
 * @param ipfs
 * @returns {Promise<*>}
 */
export async function getPeers(ipfs) {
  const peers = await ipfs.swarm.peers();
  if (peers.length && peers.length > 0) {
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
export async function waitForSomePeers(ipfs) {
  let peers = await getPeers(ipfs);

  while (peers === undefined) {
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
export const waitForPeer = async (ipfs, peerID) => {
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
 * Node management: Each node has its own repo and
 * there can't be two nodes with the same repo.
 *
 * This objects lets us manage multiple nodes when testing.
 * Use `clearNodes` when you need to empty this map.
 *
 * @type {Map<any, any>}
 */
const NODES = new Map();

/**
 * Clear all the nodes previously instantiated by `getIPFS`.
 *
 * @returns {PromiseConstructor.all}
 */
export function clearNodes() {
  const deleteOps = NODES.forEach(async (value, key, map) => {
    await value.stop();
    map.delete(key);
  })

  return new Promise.all(deleteOps);
}

/**
 * Return a new IPFS object ready for use.
 * Go through `NODES` management to let you clean
 * up after tests.
 *
 * The object has 2 more method:
 * - `isReady`
 * - `waitForSomePeers`
 *
 * @param options
 * @returns {getIPFS|IPFS}
 */
export function getIPFS(options) {
  console.log('Get IPFS instance with:', options);

  const ipfs = new IPFS(options);

  if (NODES.has(options.repo)) {
    throw new Exception('IPFS repo duplicate, clear first!');
  }
  NODES.set(options.repo, ipfs);

  let readyResolve = null;
  let readyReject = null;
  const isReady = new Promise((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });

  const oldStop = ipfs.stop;

  // TODO: make the management less fragile.
  // This will break if you start the instance again.
  // The point is to let us stop and start instances during
  // testing and avoid collision with repo names.
  ipfs.stop = async () => {
    await oldStop();
    NODES.delete(options.repo);
  }

  ipfs.on('ready', () => {
    console.log('IPFS is ready...');
    readyResolve(true);
  });

  ipfs.on('error', e => {
    console.error('IPFS failed to start: ', e);
    readyReject(e);
  });

  ipfs.ready = () => isReady;
  ipfs.waitForSomePeers = () => waitForSomePeers(ipfs);
  ipfs.waitForPeer = peerID => waitForPeer(ipfs, peerID);

  return ipfs;
}
