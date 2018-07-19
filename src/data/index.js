/* @flow */
import * as ipfs from './ipfs';
import { UserProfile, orbitSetup } from './orbit';
import type {
  B58String,
  Colony,
  ColonyAddress,
  ColonyIPFSNode,
  DataOptions,
  Domain,
  IPFSHash,
  OrbitKVStore,
  OrbitNode,
  Pinner,
  PublicKey,
  Task,
} from './types';

import METACOLONY_ADDRESS from '../utils/constants';

export default class Data {
  _pinner: ?Pinner;
  /*
    Returns metadata for the given user.
  */
  async getUserProfile(key: PublicKey): Promise<UserProfile> {
    const store = await this._orbitNode.kvstore(key);
    await store.load();
    return new UserProfile(store);
  }

  /*
    Returns metadata for the logged-in user's profile.
  */
  async getMyUserProfile(): Promise<UserProfile> {
    const store = await this.getUserProfile('user-profile');
    await this._pinner.pinKVStore(store.address);
    return store;
  }

  /*
    Adds a colony to the UserProfile
  */
  async joinColony(colonyHash: string) {
    const store = await this.getUserProfile('user-profile');
    await store.joinColony(colonyHash);
  }

  /*
    Returns metadata for the MetaColony. Meta.
  */
  async getMetaColony(): Promise<Colony> {}

  /*
    Returns metadata for the given colony.
  */
  async getColony(colonyId: string): Promise<Colony> {
    return Colony;
  }

  /*
    Returns metadata and tasks for the given domain.
  */
  async getDomain(domain: string): Promise<Domain> {}
  /*
    Returns the IPFS documents corresponding to an array of hashes
  */
  async getComment(commentHash: IPFSHash): Promise<Comment[]> {
    return this._ipfsNode.cat(commentHash);
  }

  /*
   Returns the IPFS documents corresponding to an array of hashes
  */
  async getComments(commentHashes: IPFSHash[]) {
    return Promise.all(
      commentHashes.map(commentHash => this.getComment(commentHash)),
    );
  }

  /*
   Creates IPFS document, and stores the resulting hash in the task entry
  */
  async addComment(domainKey: string, taskID: string, comment: Comment) {
    const domain = await this.getDomain(domainKey);
    const hash = ipfs.addComment(comment);
    await domain.addComment(taskID, hash);
  }

  /*
   Stores a task in 'draft mode' in orbitDB
   When the task is assigned, it is sent on-chain, and the draft task is deleted
  */
  async draftTask(task: Task): Promise<Task> {
    return Task;
  }

  /*
   Setup
   */

  _pinner: Pinner;

  _ipfsNode: ColonyIPFSNode;

  _orbitNode: OrbitNode;

  _key: string;

  // TODO Data class should not require consumers to start and pass in IPFS and Orbit
  constructor(pinner: ?Pinner, ipfsNode: ColonyIPFSNode, orbitNode: OrbitNode) {
    this._pinner = pinner;
    this._ipfsNode = ipfsNode;
    this._orbitNode = orbitNode;
    this._key = 'helloworld';
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
