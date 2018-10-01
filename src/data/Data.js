/* @flow */
import * as ipfs from './ipfs';
import { orbitSetup, UserProfile } from './orbit';
import type {
  ColonyIPFSNode,
  DataOptions,
  OrbitKVStore,
  OrbitNode,
  Pinner,
  PublicKey,
  UserProfileType,
} from './types';

export default class Data {
  /*
    Returns UserProfile store class for the given user.
  */
  async _getUserProfile(key: PublicKey): any {
    const store = await this._orbitNode.kvstore(key);
    await store.load();

    if (this._pinner) {
      await this._pinner.pin(store);
    }
    return new UserProfile(store);
  }

  /*
    Returns metadata for the logged-in user's profile.
  */
  async _getMyUserProfile(
    key: PublicKey = 'user-profile',
  ): Promise<OrbitKVStore> {
    const store = await this._getUserProfile(key);
    return store;
  }

  /*
    Adds to or edits the UserProfile
    Also used to set all properties at once
  */
  async editUserProfile(property: string, value: any) {
    const store = await this._getMyUserProfile();
    const result = await store.setProperty(property, value);
    return result;
  }

  /*
  Returns value of given profile property
  */
  async getUserProfileProperty(
    key: PublicKey = 'user-profile',
    property: string,
  ) {
    const store = await this._getUserProfile(key);
    const result = await store.getProperty(property);
    return result;
  }

  /*
  Returns all profile data as an object
  */
  async getUserProfileData(key: PublicKey = 'user-profile'): any {
    const store = await this._getUserProfile(key);
    const profile = await store.getWholeProfile();
    return profile;
  }
  /*
   Setup
   */

  _pinner: ?Pinner;

  _ipfsNode: ColonyIPFSNode;

  _orbitNode: OrbitNode;

  _key: string;

  constructor(pinner: ?Pinner, ipfsNode: ColonyIPFSNode, orbitNode: OrbitNode) {
    this._pinner = pinner;
    this._ipfsNode = ipfsNode;
    this._orbitNode = orbitNode;
    this._key = 'helloworld';
    this.ready = this.ready.bind(this);
  }

  // @TODO This design is time-dependent and relies
  // on lots of mutations, refactor to work with a builder
  // pattern that is immutable.
  async ready(): Promise<boolean> {
    await this._ipfsNode.ready();
    return true;
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
    const orbitConf = orbitSetup.makeOptions(opts.orbit);
    const orbitNode = await orbitSetup.getOrbitDB(ipfsNode, orbitConf);

    return new Data(pinner, ipfsNode, orbitNode);
  }
}
