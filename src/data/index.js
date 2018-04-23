/* @flow */
import { getIPFS, IPFS, makeOptions } from './ipfs';
import OrbitDB from 'orbit-db';

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
  _ipfsNode: IPFS;
  _orbitNode: OrbitDB;
  _key: string;

  constructor(ipfsNode) {
    this._ipfsNode = ipfsNode;
    this._key = "helloworld";
  }

  async close() {
    await this._ipfsNode.stop();
  }

  static fromDefaultConfig(opts) {
    const defaultConfig = makeOptions(opts);
    const ipfsNode = getIPFS(defaultConfig);
    return new Data(ipfsNode);
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
