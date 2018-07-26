/* @flow */
import * as ipfs from './ipfs';
import { Kolonie, orbitSetup, UserProfile } from './orbit';
import type {
  Colony,
  ColonyIPFSNode,
  DataOptions,
  Domain,
  IPFSHash,
  OrbitKVStore,
  OrbitNode,
  Pinner,
  Pot,
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
  async getMyUserProfile(
    key: PublicKey = 'user-profile',
  ): Promise<OrbitKVStore> {
    const store = await this.getUserProfile(key);
    await this._pinner.pinKVStore(store.address());
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
  async getMetaColony(): Promise<Colony> {
    const metacolony = await this._orbitNode.kvstore(METACOLONY_ADDRESS);
    await metacolony.load();
    return metacolony;
  }

  /*
    Returns metadata for the given colony.
  */
  async getColony(colonyID: string): Promise<Colony> {
    const colony = await this._orbitNode.kvstore(colonyID);
    await colony.load();
    return new Kolonie(colony);
  }

  /*
    Given a colonyID and an image, sets the colony's avatar
  */
  async setColonyAvatar(colonyID: string, avatar: Image) {
    const imageHash = await this._ipfsNode.addImage(avatar);
    const colony = await this.getColony(colonyID);
    await colony.setAvatar(imageHash);
    return;
  }

  /*
    Given a colonyID and an imageHash, returns the colony's avatar
  */
  async getColonyAvatar(colonyID: string, avatar: string) {
    const imageHash = this._ipfsNode.addImage(avatar);
    const colony = await this.getColony(colonyID);
    colony.setAvatar(imageHash);
  /*
    Given a colonyID and a funding pot, sets the colony's pot
  */
  async setColonyPot(colonyID: string, pot: Pot) {
    const colony = await this.getColony(colonyID);
    await colony.setPot(pot);
    return;
  }

  /*
    Returns the colony's pot
  */
  async getColonyPot(colonyID: string) {
    const colony = await this.getColony(colonyID);
    return colony.getPot();
  }

  /*
    Given a colonyID and a domainID, adds a domain to the colony's list 
  */
  async addColonyDomain(colonyID: string, domainID: string) {
    const colony = await this.getColony(colonyID);
    await colony.addDomain(domainID);
    return;
  }

  /*
    Returns the colony's domains
  */
  async getColonyDomains(colonyID: string) {
    const colony = await this.getColony(colonyID);
    return colony.getDomains();
  }

  /*
    Returns metadata and tasks for the given domain.
  */
  async getDomain(domainKey: string): Promise<Domain> {
    const domain = await this._orbitNode.kvstore(domainKey);
    await domain.load();
    return domain;
  /*
    Given a colonyID and a userID, adds a user to the colony's list 
  */
  async addColonyMember(colonyID: string, userID: string) {
    const colony = await this.getColony(colonyID);
    await colony.addMember(userID);
    return;
  }

  /*
    Returns the colony's users
  */
  async getColonyMembers(colonyID: string) {
    const colony = await this.getColony(colonyID);
    return colony.getMembers();
  }

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
    const hash = this._ipfsNode.addComment(comment);
    await domain.addComment(taskID, hash);
  }

  /*
   Stores a task in 'draft mode' in orbitDB
   When the task is assigned, it is sent on-chain, and the draft task is deleted
  */
  async draftTask(domainKey: string, task: Task) {
    const domain = await this.getDomain(domainKey);
    await domain.addTask(task);
  }

  waitForPeer(peerID: B58String): Promise<boolean> {
    return this._ipfsNode.waitForPeer(peerID);
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
