/* @flow */
import * as ipfs from './ipfs';
import { getNodeID } from './ipfs';
import * as orbit from './orbit';

type PeerId = string;
type PublicKey = string;

class UserProfile {
  constructor(store) {
    this._store = store;
    this._store.events.on('replicated', addr => {
      console.log('Store replicated addr=', addr);
    })
  }

  getCreated() {
    return this._store.get('created');
  }

  isEmpty(): boolean {
    console.log("GET CREATED", this._store.get('created'));
    return !this.getCreated()
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
    f({ name: this.getName(), isEmpty: this.isEmpty(), created: this.getCreated() });

    this._store.events.on('replicated', (addr) => {
      console.log(
        'UserProfile at address=', this.address(),
        'replicated with address=', addr
      );
      f({ name: this.getName(), isEmpty: this.isEmpty(), created: this.getCreated() });
    })
  }
}

export default class Data {
  _ipfsNode: ipfs.IPFS;
  _orbitNode: orbit.OrbitDB;
  _key: string;

  constructor(pinner, ipfsNode, orbitNode) {
    this._pinner = pinner;
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

  async waitForPeer(peerID) {
    return await this._ipfsNode.waitForPeer(peerID);
  }

  async peerID() {
    return await getNodeID(this._ipfsNode);
  }

  async stop() {
    await this._orbitNode.stop();
    await this._ipfsNode.stop();
  }

  static async fromDefaultConfig(pinner, opts) {
    const ipfsConf = ipfs.makeOptions(opts.ipfs);
    const ipfsNode = ipfs.getIPFS(ipfsConf);
    await ipfsNode.ready();

    const orbitConf = orbit.makeOptions(opts.orbit);
    const orbitNode = await orbit.getOrbitDB(ipfsNode, orbitConf);

    return new Data(pinner, ipfsNode, orbitNode);
  }

  // TODO(laurent): abstract away orbitdb.
  // right now this takes an orbitdb address (either name, or full address)
  async getUserProfile(key: PublicKey): UserProfile {
    console.log('Build User Profile Store with key=', key);
    const store = await this._orbitNode.kvstore(key);
    console.log('Pin User Profile Store with address=', store.address);
    await store.load();
    await this._pinner.pinKVStore(store.address);
    console.log('Complete User Profile Store creations');
    return new UserProfile(store);
  }

  async getMyUserProfile(): UserProfile {
    return this.getUserProfile('user-profile');
  }

  async listPeers(): Array<PeerId> {
    const peers = await this._ipfsNode.swarm.peers();
    return peers.map(x => x.peer.id.toB58String());
  }
}
