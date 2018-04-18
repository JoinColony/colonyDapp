/* @flow */
import * as ipfs from './ipfs';
import * as orbit from './orbit';

type PeerId = string;
type PublicKey = string;

class UserProfile {
  name: string;
  is_empty: boolean;

  constructor() {
    this.name = undefined;
    this.is_empty = true;
  }

  isEmpty(): boolean {
    return this.is_empty;
  }

  setName(name: string) {
    this.name = name;
    this.is_empty = false;
  }
}

export default class Data {
  _ipfsNode: ipfs.IPFS;
  _orbitNode: orbit.OrbitDB;
  _key: string;

  constructor(ipfsNode, orbitNode) {
    this._ipfsNode = ipfsNode;
    this._orbitNode = orbitNode;
    this._key = "helloworld";
  }

  // TODO(laurent): This design is time-dependant and relies
  // on lots of mutations, refactor to work with a builder
  // pattern that is immutable.
  async ready() {
    await this._ipfsNode.ready();
    return true;
  }

  async peerId() {
    return new Promise((resolve, error) => {
      this._ipfsNode.id((err, x) => resolve(x.id));
    })
  }

  async close() {
    await this._ipfsNode.stop();
  }

  static fromDefaultConfig(opts) {
    const ipfsConf = ipfs.makeOptions(opts);
    const ipfsNode = ipfs.getIPFS(ipfsConf);
    const orbitConf = orbit.makeOptions(opts);
    const orbitNode = orbit.getOrbitDB(ipfsNode, orbitConf);

    return new Data(ipfsNode, orbitNode);
  }

  async getUserProfile(key: PublicKey): UserProfile {
    return new Promise((r) => {
      r(new UserProfile())
    });
  }

  async getMyUserProfile(): UserProfile {
    return this.getUserProfile(this._key);
  }

  async listPeers(): Array<PeerId> {
    const peers = await this._ipfsNode.swarm.peers();
    return peers.map(x => x.peer.id.toB58String());
  }
}
