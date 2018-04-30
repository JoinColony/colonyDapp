import rimraf from 'rimraf';
import { timePrefix } from '../../src/utils/time';
import * as ipfs from '../../src/data/ipfs'
import * as orbit from '../../src/data/orbit'
import { makePinner } from './pinner.mock'

const ROOT_REPO = '/tmp/tests/';

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

  async ready() {
    // Wait for the ipfs nodes to be up
    await Promise.all(this._ipfsNodes.map(x => x.ready()));

    // Wait for the nodes to be connected to the pinner
    if (this._pinner) {
      await Promise.all(this._ipfsNodes.map(x => this._pinner.waitForMe(x)));
    }

    // No need to wait for orbit-db nodes
  }

  async clear() {
    if (this._pinner) {
      this._pinner.stop();
    }

    await Promise.all(this._orbitNodes.map(x => x.stop()));
    await Promise.all(this._ipfsNodes.map(x => x.stop()));

    await new Promise((resolve, reject) => {
      rimraf(this._rootRepo, {}, (err) => err ? reject(err) : resolve());
    });
  }
}