/* @flow */

import { open as openWallet } from '@colony/purser-software';

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

window.orbit = orbit;
window.ipfs = ipfs;

(async function() {
  const wallet = await openWallet({
    mnemonic:
      'vibrant crane range exhaust guide culture total blossom genuine error manual lock',
  });

  const verifySignatureFn = async (walletAddress, data, signature) =>
    wallet.verifyMessage({
      message: data,
      signature,
    });

  const acl = new orbit.EthereumAccountAccessController(
    wallet.address,
    verifySignatureFn,
  );

  // Uncomment to create an identity
  // const identity = await orbit.createOrbitIdentity(wallet, wallet.address);
  const identity = await orbit.getOrbitIdentity(wallet, wallet.address);

  const ipfsConf = ipfs.makeOptions();
  const ipfsNode = ipfs.getIPFS(ipfsConf);
  const orbitConf = orbit.makeOptions();
  await ipfsNode.ready();

  const orbitNode = await orbit.getOrbitDB(ipfsNode, identity, orbitConf);

  // Uncomment to create a store
  // const kv = await orbitNode.kvstore('my-store', {
  //   accessController: acl,
  // });
  const kv = await orbitNode.kvstore(
    '/orbitdb/QmcKkpwTvwE7tebFRLcHN9qChGUaX8kePovW7xYLcy3bkv/my-store',
    {
      accessController: acl,
    },
  );

  // Uncomment to populate the store
  // await kv.put('foo', 'bar');
  await kv.load();
  const foo = await kv.get('foo');
  console.log(foo);
})();

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
  _pinner: ?Pinner;

  _ipfsNode: ColonyIPFSNode;

  _orbitNode: OrbitNode;

  _key: string;

  constructor(pinner: ?Pinner, ipfsNode: ColonyIPFSNode, orbitNode: OrbitNode) {
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
    pinner: ?Pinner,
    opts: DataOptions = { ipfs: {}, orbit: {} },
  ): Promise<Data> {
    const ipfsConf = ipfs.makeOptions(opts.ipfs);
    const ipfsNode = ipfs.getIPFS(ipfsConf);

    await ipfsNode.ready();

    // If we passed some bootstrap nodes,
    // wait for some of them to be available.
    if (opts.ipfs.bootstrap) {
      await ipfsNode.waitForSomePeers();
    }

    const orbitConf = orbit.makeOptions(opts.orbit);
    const orbitNode = await orbit.getOrbitDB(ipfsNode, orbitConf);

    return new Data(pinner, ipfsNode, orbitNode);
  }

  async getUserProfile(key: PublicKey): Promise<UserProfile> {
    const store = await this._orbitNode.kvstore(key);
    await store.load();

    if (this._pinner) {
      await this._pinner.pin(store);
    }
    return new UserProfile(store);
  }

  async getMyUserProfile(): Promise<UserProfile> {
    return this.getUserProfile('user-profile');
  }

  async listPeers(): Promise<B58String[]> {
    const peers = await this._ipfsNode.swarm.peers();
    return peers.map(x => x.peer.toB58String());
  }
}
