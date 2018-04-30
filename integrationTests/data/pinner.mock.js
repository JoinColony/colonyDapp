import * as ipfs from "../../src/data/ipfs"
import { getOrbitDB } from "../../src/data/orbit"

/**
 * Pinner object, mimick a pinning service that'll
 * be used to store content & sync nodes.
 *
 * @returns {Promise<{node: (getIPFS|IPFS), tcp: (function(): string), ws: (function(): string), pinBlock: (function(*=): *), peers: *}>}
 * @constructor
 */
export async function Pinner() {
  const node = ipfs.getIPFS(ipfs.makeOptions({
    repo: '/tmp/tests/pinner',
    bootstrap: [],
    swarm: [
      "/ip4/0.0.0.0/tcp/5002",
      "/ip4/127.0.0.1/tcp/5003/ws",
    ]
  }));

  await node.ready();

  const p = new Promise((resolve, reject) => {
    node.id((err, n) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      else {
        resolve(n.id);
      }
    })
  })

  const nodeID = await p;
  const tcp = () => `/ip4/127.0.0.1/tcp/5002/ipfs/${nodeID}`;
  const ws = () => `/ip4/127.0.0.1/tcp/5003/ws/ipfs/${nodeID}`;

  const orbit = await getOrbitDB(node, { path: '/tmp/tests/pinnerOrbit' })
  const dbs = [];

  return {
    node,
    nodeID,
    orbit,
    tcp, ws,
    peers: () => node.swarm.peers(),
    waitForMe: (ipfsNode) => ipfsNode.waitForPeer(nodeID),
    bootstrap: () => [tcp(), ws()],
    pinBlock: (id) => node.block.get(id),
    pinKVStore: async (addr) => dbs.push(await orbit.keyvalue(addr)),
    stop: async () => console.log("TODO")
  }
}
