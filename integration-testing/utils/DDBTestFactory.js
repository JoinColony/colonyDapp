import rimraf from 'rimraf';

import { timePrefix } from './tools';

import createIPFSNode from './createIPFSNode';
import createOrbitNode from './createOrbitNode';

const ROOT_REPO = '/tmp/tests/';

/**
 * Provides the means to create a mini cluster
 * of ipfs, orbit and Data nodes.
 *
 * Handles pinners, and waiting between nodes
 * to make testing more straightforward.
 *
 * Handles setup & cleanup processes to
 * make testing more predictable & avoid
 * name collisions.
 *
 * Use the `pinner`, `node`, `orbit`
 * functions to generate new nodes.
 *
 * Use the `ready` and `clear` functions
 * to manage setup / teardown tests.
 *
 * After `ready()`, any instance produced by this
 * factory will be connected to the others through the
 * `pinner` object.
 *
 * @TODO Fix libp2p error logged when tests finish,
 *   Sometimes, OrbitDB throws: `libp2p node is not started yet`.
 *   Corresponding issue:
 *   - https://github.com/ipfs-shipyard/ipfs-pubsub-room/issues/42
 */
export default class DDBTestFactory {
  static TIMEOUT = 60000;

  constructor(testPrefix) {
    this._testPrefix = testPrefix;
    this._timePrefix = timePrefix();
    this._prefix = `${this._testPrefix}_${this._timePrefix}`;

    this._rootRepo = `${ROOT_REPO}/${this._prefix}/`;

    this._pinner = null;
    this._ipfsNodes = [];
    this._orbitNodes = [];
    // this._datas = [];
  }

  async _bootstrap() {
    if (!this._pinner) {
      console.warn('You probably need a pinner service.');
      return [];
    }

    return this._pinner.bootstrapServers();
  }

  name(suffix) {
    return `${this._prefix}_${suffix}`;
  }

  async node(name) {
    const node = await createIPFSNode({
      repo: `${this._rootRepo}/ipfs/${name}`,
      config: {
        Bootstrap: await this._bootstrap(),
        Addresses: {
          Gateway: '',
          Swarm: [],
        },
      },
    });
    this._ipfsNodes.push(node);
    return node;
  }

  async orbit(name) {
    const ipfsNode = await this.node(name);
    const orbitNode = await createOrbitNode(ipfsNode.getIPFS(), name, {
      path: `${this._rootRepo}/orbit/${name}`,
    });
    this._orbitNodes.push(orbitNode);
    return orbitNode;
  }

  async ready() {
    // Wait for the ipfs nodes to be up
    // @TODO at this point we may need to wait for the node to be connected to a pinner node
    // No need to wait for orbit-db nodes
    await Promise.all(this._ipfsNodes.map(ipfsNode => ipfsNode.ready));
  }

  async clear() {
    if (this._pinner) {
      this._pinner.stop();
    }

    await Promise.all(this._orbitNodes.map(orbit => orbit.stop()));
    await Promise.all(
      this._ipfsNodes.map(ipfsNode => ipfsNode.getIPFS().stop()),
    );

    await new Promise((resolve, reject) => {
      rimraf(this._rootRepo, {}, err => (err ? reject(err) : resolve()));
    });
  }
}
