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

export default class DataAPI {
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
    this.editUserProfile = this.editUserProfile.bind(this);
    this._getUserProfile = this._getUserProfile.bind(this);
    this._getMyUserProfile = this._getMyUserProfile.bind(this);
    this.getUserProfileData = this.getUserProfileData.bind(this);
  }

  /*
    Returns UserProfile store class for the given user.
  */
  _getUserProfile = async (key: PublicKey): any => {
    const store = await this._orbitNode.kvstore(key);
    await store.load();

    if (this._pinner) {
      await this._pinner.pin(store);
    }
    const userProfile = await UserProfile.create(store);

    return userProfile;
  };

  /*
    Returns metadata for the logged-in user's profile.
  */
  _getMyUserProfile = async (
    key: PublicKey = 'user-profile',
  ): Promise<OrbitKVStore> => {
    const store = await this._getUserProfile(key);
    return store;
  };

  /*
    Adds to or edits the UserProfile
  */
  editUserProfile = async (
    property: string,
    value: any,
    profileKey: string,
  ) => {
    const store = await this._getMyUserProfile(profileKey);
    const result = await store.setProperty(property, value);
    return result;
  };

  /*
      Sets (replaces) all UserProfile properties at once
    */
  setUserProfile = async (properties: UserProfileType, profileKey: string) => {
    const store = await this._getMyUserProfile(profileKey);
    const result = await store.setWholeProfile(properties);
    return result;
  };

  /*
  Returns value of given profile property
  */
  getUserProfileProperty = async (
    key: PublicKey = 'user-profile',
    property: string,
  ) => {
    const store = await this._getUserProfile(key);
    const result = await store.getProperty(property);
    return result;
  };

  /*
  Returns all profile data as an object
  */
  getUserProfileData = async (
    key: PublicKey = 'user-profile',
  ): Promise<UserProfileType> => {
    const store = await this._getUserProfile(key);
    const profile = await store.getWholeProfile();
    return profile;
  };

  ready = async (): Promise<boolean> => {
    await this._ipfsNode.ready();
    return true;
  };

  stop = async (): Promise<void> => {
    await this._orbitNode.stop();
    return this._ipfsNode.stop();
  };

  static async fromDefaultConfig(
    pinner: ?Pinner,
    opts: DataOptions = { ipfs: {}, orbit: {} },
  ): Promise<DataAPI> {
    const ipfsConf = ipfs.makeOptions(opts.ipfs);
    const ipfsNode = ipfs.getIPFS(ipfsConf);
    const orbitConf = orbitSetup.makeOptions(opts.orbit);
    const orbitNode = await orbitSetup.getOrbitDB(ipfsNode, orbitConf);

    return new DataAPI(pinner, ipfsNode, orbitNode);
  }
}
