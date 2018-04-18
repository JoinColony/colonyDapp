/* @flow */
import IPFS from 'ipfs';

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

  constructor(ipfsNode) {
    this._ipfsNode = ipfsNode;
  }

  static fromDefaultConfig() {
    return new Data();
  }

  async getUserProfile(key: PublicKey): UserProfile {
    return new UserProfile();
  }

  async listPeers(): Array<PeerId> {
    const peers = await ipfsNode.swarm.peers();
    return peers.map(x => x.peer.id.toB58String());
  }
}
