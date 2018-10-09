import rimraf from 'rimraf';

import createIPFSNode from './createIPFSNode';
import createOrbitNode from './createOrbitNode';

const MOCK_PINNERS_ROOT = '/tmp/tests/pinners/';

/**
 * Pinner object,
 * mimick a pinning service that stores content & sync nodes.
 *
 * @returns {Promise<{node: (getIPFS|IPFS), tcp: (function(): string), ws: (function(): string), pinBlock: (function(*=): *), peers: *}>}
 * @constructor
 */
export default (async function makePinner(pinnerName) {
  const pinnerRoot = `${MOCK_PINNERS_ROOT}/${pinnerName}`;

  const ipfsNode = await createIPFSNode({
    repo: `${pinnerRoot}/ipfsRepo`,
    config: {
      Bootstrap: [],
      Addresses: {
        Swarm: ['/ip4/0.0.0.0/tcp/5002', '/ip4/127.0.0.1/tcp/5003/ws'],
      },
    },
  });

  await ipfsNode.ready;

  // Get Node ID
  const nodeID = await ipfsNode.getNodeID();
  const ipfs = ipfsNode.getIPFS();

  const bootstrap = [
    `/ip4/127.0.0.1/tcp/5002/ipfs/${nodeID}`,
    `/ip4/127.0.0.1/tcp/5003/ws/ipfs/${nodeID}`,
  ];

  const orbit = await createOrbitNode(ipfs, 'pinnerOrbit', {
    path: `${pinnerRoot}/orbitRepo`,
  });

  const stop = async () => {
    await orbit.stop();
    await ipfs.stop();
    await new Promise((resolve, reject) => {
      rimraf(pinnerRoot, {}, err => (err ? reject(err) : resolve()));
    });
  };

  const pinnedStores = [];

  return {
    stop,
    node: ipfs,
    orbit,
    nodeID,
    bootstrapServers: async () => bootstrap,
    waitForMe: () => ipfsNode.waitForPeer(nodeID),
    pinBlock: id => ipfs.block.get(id),
    pin: async store => {
      const localStore = await orbit.keyvalue(store.address);
      pinnedStores.push(localStore);
    },
  };
});
