/* @flow */
import * as ipfs from './ipfs';
import * as orbit from './orbit';
import type {
  B58String,
  ColonyIPFSNode,
  DataOptions,
  OrbitKVStore,
  OrbitNode,
  Pinner,
} from './types';

type PublicKey = string;

class UserProfile {
  _store: OrbitKVStore;

  constructor(store) {
    this._store = store;
  }

  isEmpty(): boolean {
    return !this._store.get('created');
  }

  async setName(name: string) {
    if (this.isEmpty()) {
      await this._store.put('created', new Date().toUTCString());
    }
    await this._store.put('name', name);
  }

  getName() {
    return this._store.get('name');
  }

  address() {
    return this._store.address;
  }

  subscribe(f) {
    this._store.events.on('replicated', () => {
      f({ name: this.getName() });
    });
  }
}

export default class Data {
  _pinner: Pinner;
  _ipfsNode: ColonyIPFSNode;
  _orbitNode: OrbitNode;
  _key: string;

  constructor(pinner: Pinner, ipfsNode: ColonyIPFSNode, orbitNode: OrbitNode) {
    this._pinner = pinner;
    this._ipfsNode = ipfsNode;
    this._orbitNode = orbitNode;
    this._key = 'helloworld';
  }

  // @TODO This design is time-dependant and relies
  // on lots of mutations, refactor to work with a builder
  // pattern that is immutable.
  async ready(): Promise<boolean> {
    await this._ipfsNode.ready();
    return true;
  }

  async waitForPeer(peerID: B58String): Promise<boolean> {
    return this._ipfsNode.waitForPeer(peerID);
  }

  async peerID(): Promise<B58String> {
    return ipfs.getNodeID(this._ipfsNode);
  }

  async stop(): Promise<void> {
    await this._orbitNode.stop();
    return this._ipfsNode.stop();
  }

  static async fromDefaultConfig(
    pinner: Pinner,
    opts: DataOptions = { ipfs: {}, orbit: {} },
  ): Promise<Data> {
    const ipfsConf = ipfs.makeOptions(opts.ipfs);
    const ipfsNode = ipfs.getIPFS(ipfsConf);

    const orbitConf = orbit.makeOptions(opts.orbit);
    const orbitNode = await orbit.getOrbitDB(ipfsNode, orbitConf);

    return new Data(pinner, ipfsNode, orbitNode);
  }

  async getUserProfile(key: PublicKey): Promise<UserProfile> {
    const store = await this._orbitNode.kvstore(key);
    await store.load();
    await this._pinner.pinKVStore(store.address);
    return new UserProfile(store);
  }

  async getMyUserProfile(): Promise<UserProfile> {
    return this.getUserProfile('user-profile');
  }

  async listPeers(): Promise<B58String[]> {
    const peers = await this._ipfsNode.swarm.peers();
    return peers.map(x => x.peer.id.toB58String());
  }
}
