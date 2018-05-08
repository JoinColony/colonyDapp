import rimraf from 'rimraf';
import { timePrefix } from '../../src/utils/time';
import * as ipfs from '../../src/data/ipfs'
import * as orbit from '../../src/data/orbit'
import { makePinner } from './pinner.mock'
import Data from "../../src/data"

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
 * Use the `pinner`, `node`, `orbit` and `Data`
 * functions to generate new nodes.
 *
 * Use the `ready` and `clear` functions
 * to manage setup / teardown tests.
 *
 * After `ready()`, any instance produced by this
 * factory will be connected to the others through the
 * `pinner` object.
 */
export default class Factory {
  static TIMEOUT = 60000;

  constructor(testPrefix) {
    this._testPrefix = testPrefix;
    this._timePrefix = timePrefix();
    this._prefix = `${this._testPrefix}_${this._timePrefix}`;

    this._rootRepo = `${ROOT_REPO}/${this._prefix}/`

    this._pinner = null;
    this._ipfsNodes = [];
    this._orbitNodes = [];
    this._datas = [];
  }


  _bootstrap() {
    if (this._pinner) {
      return this._pinner.bootstrap;
    }
    else {
      console.log('WARNING: no pinner?');
      return [];
    }
  }

  name(suffix) {
    return `${this._prefix}_${suffix}`;
  }

  async pinner() {
    if (this._pinner) {
      throw new Error('trying to create 2 pinners, not handled');
    }

    this._pinner = await makePinner(`${this._prefix}_pinner`);
    return this._pinner;
  }


  async node(name) {
    const node = ipfs.getIPFS(ipfs.makeOptions({
      repo: `${this._rootRepo}/ipfs/${name}`,
      bootstrap: this._bootstrap()
    }));
    this._ipfsNodes.push(node);
    return node;
  }

  async orbit(name) {
    const node = await this.node(name);
    const orbitNode = await orbit.getOrbitDB(node, orbit.makeOptions({
      repo: `${this._rootRepo}/orbit/${name}`
    }));
    this._orbitNodes.push(orbitNode);
    return orbitNode;
  }

  async Data(name) {
    const data = await Data.fromDefaultConfig(
      this._pinner,
      {
        ipfs: {
          repo: `${this._rootRepo}/ipfs/${name}`,
          bootstrap: this._bootstrap()
        },
        orbit: {
          repo: `${this._rootRepo}/ipfs/${name}`
        }
      });

    this._datas.push(data);
    return data;
  }

  async ready() {
    // Wait for the ipfs nodes to be up
    await Promise.all(this._ipfsNodes.map(x => x.ready()));
    await Promise.all(this._datas.map(x => x.ready()));

    // Wait for the nodes to be connected to the pinner
    if (this._pinner) {
      await Promise.all(this._ipfsNodes.map(x => this._pinner.waitForMe(x)));
      await Promise.all(this._datas.map(x => x.waitForPeer(this._pinner.nodeID)));
    }

    // No need to wait for orbit-db nodes
  }

  async clear() {
    if (this._pinner) {
      this._pinner.stop();
    }

    await Promise.all(this._datas.map(x => x.stop()));
    await Promise.all(this._orbitNodes.map(x => x.stop()));
    await Promise.all(this._ipfsNodes.map(x => x.stop()));

    await new Promise((resolve, reject) => {
      rimraf(this._rootRepo, {}, (err) => err ? reject(err) : resolve());
    });
  }
}