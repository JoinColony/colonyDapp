/* @flow */
import rimraf from 'rimraf';
import * as ipfs from './ipfs';
import { Domane, Kolonie, orbitSetup, UserProfile } from './orbit';
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
  /*
    Returns metadata for the given user.
  */
  async getUserProfile(key: PublicKey): Promise<UserProfile> {
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
  async getMyUserProfile(
    key: PublicKey = 'user-profile',
  ): Promise<OrbitKVStore> {
    const store = await this.getUserProfile(key);
    return store;
  }

  /*
    Adds a colony to the UserProfile
  */
  async joinColony(colonyHash: string) {
    const store = await this.getMyUserProfile();
    console.log(store);
    const result = await store.joinColony(colonyHash);
    console.log(result);
    return colonyHash;
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
  Given a colonyId and an object with the property and value to set, updates a simple property
  */
  async updateColony(
    colonyId: string,
    { property, value }: {},
  ): Promise<Colony> {
    const colony = await this._getColony(colonyId);
    await colony.setProperty(property, value);
    return;
  }

  /*
  Given a domainId and an object with the property and value to set, updates a simple property
  */
  async updateDomain(
    domainId: string,
    { property, value }: {},
  ): Promise<Domain> {
    const domain = await this._getDomain(colonyId);
    await domain.setProperty(property, value);
    return;
  }

  /*
  Given a taskId and an object with the property and value to set, updates a simple property
  */
  async updateTask(
    domainId: string,
    taskId: string,
    { property, value }: {},
  ): Promise<Task> {
    const domain = await this._getDomain(colonyId);
    const tasks = domain.getTasks();
    const task = tasks.filter(t => t._id === taskId)[0];

    if (Array.isArray(task[property])) {
      task[property].push(value);
    } else {
      task[property] = value;
    }
    await domain.setProperty('tasks', tasks);

    return taskId;
  }

  // TODO load avatar from avatarHash
  /*
    Returns metadata for the given colony.
  */
  async loadColony(colonyId: string): Promise<Colony> {
    const colony = await this._getColony(colonyId);
    const data = await colony.allProperties();
    return data;
  }

  /*
    Given a colonyID and an image, sets the colony's avatar
  */
  async setColonyAvatar(colonyID: string, avatar: Image) {
    const imageHash = await this._ipfsNode.addImage(avatar);
    const colony = await this._getColony(colonyID);
    await colony.setAvatar(imageHash);
    return;
  }

  /*
    Returns the colony's avatar
  */
  async getColonyAvatar(colonyID: string) {
    const colony = await this._getColony(colonyID);
    const avatarHash = await colony.getAvatar();

    const avatar = await this._ipfsNode.ipfsCat(avatarHash);
    return avatar;
  }

  /*
    Given a colonyID and a funding pot, sets the colony's pot
  */
  async setColonyPot(colonyID: string, pot: Pot) {
    const colony = await this._getColony(colonyID);
    await colony.setPot(pot);
    return pot;
  }

  /*
    Returns the colony's pot
  */
  async getColonyPot(colonyID: string) {
    const colony = await this._getColony(colonyID);
    return colony.getPot();
  }

  /*
    Given a colonyID and a domainID, adds a domain to the colony's list 
  */
  async addColonyDomain(colonyID: string, domainID: string) {
    const colony = await this._getColony(colonyID);
    await colony.addDomain(domainID);
    return;
  }

  /*
    Returns the colony's domains
  */
  async getColonyDomains(colonyID: string) {
    const colony = await this._getColony(colonyID);
    return colony.getDomains();
  }

  /*
    Returns metadata and tasks for the given domain.
  */
  async loadDomain(domainId) {
    const domain = await this._getDomain(domainId);
    const data = await domain.allProperties();
    return data;
  }

  /*
    Given a domainID and a funding pot, sets the domain's pot
  */
  async setDomainPot(domainID: string, pot: Pot) {
    const domain = await this._getDomain(domainID);
    await domain.setPot(pot);
    return;
  }

  /*
    Returns the domain's pot
  */
  async getDomainPot(domainID: string) {
    const domain = await this._getDomain(domainID);
    return domain.getPot();
  }

  /*
    Given a domainID and a userID, adds a user to the domain's list 
  */
  async addDomainMember(domainID: string, userID: string) {
    const domain = await this._getDomain(domainID);
    await domain.addMember(userID);
    return;
  }

  /*
    Returns the domain's users
  */
  async getDomainMembers(domainID: string) {
    const domain = await this._getDomain(domainID);
    const members = await domain.getMembers();
    return members;
  }

  /*
    Given a colonyID and a userID, adds a user to the colony's list 
  */
  async addColonyMember(colonyID: string, userID: string) {
    const colony = await this._getColony(colonyID);
    await colony.addMember(userID);
    return;
  }

  /*
    Returns the colony's users
  */
  async getColonyMembers(colonyID: string) {
    const colony = await this._getColony(colonyID);
    return colony.getMembers();
  }

  /*
    Returns the IPFS documents corresponding to an array of hashes
  */
  async getComment(commentHash: IPFSHash): Promise<Comment> {
    return this._ipfsNode.getComment(commentHash);
  }

  /*
   Returns the IPFS documents corresponding to an array of hashes
  */
  async getComments(commentHashes: IPFSHash[]): Promise<Comment[]> {
    return Promise.all(
      commentHashes.map(commentHash => this.getComment(commentHash)),
    );
  }

  async getTaskComments(domainID: string, taskID: string) {
    const domain = await this._getDomain(domainID);
    const commentHashes = await domain.getComments(taskID);
    return this.getComments(commentHashes);
  }

  /*
   Creates IPFS document, and stores the resulting hash in the task entry
  */
  async addComment(domainKey: string, taskID: string, comment: Comment) {
    const domain = await this._getDomain(domainKey);
    const hash = await this._ipfsNode.addComment(comment);
    await domain.addComment(taskID, hash[0].hash);
    return hash;
  }

  /*
   Stores a task in 'draft mode' in orbitDB
   When the task is assigned, it is sent on-chain, and the draft task is deleted
  */
  async draftTask(domainKey: string, task: Task) {
    const domain = await this._getDomain(domainKey);
    await domain.addTask(task);
  }

  /*
    Returns the domain's tasks
  */
  async getDomainTasks(domainID: string) {
    const domain = await this._getDomain(domainID);
    return domain.getTasks();
  }

  waitForPeer(peerID: B58String): Promise<boolean> {
    return this._ipfsNode.waitForPeer(peerID);
  }

  /*
  Returns colony data class to interact with DDB
  */
  async _getColony(colonyID: string): Promise<Colony> {
    const colony = await this._orbitNode.kvstore(colonyID);
    await colony.load();
    if (this._pinner) {
      await this._pinner.pin(colony);
    }
    return new Kolonie(colony);
  }

  /*
  Returns domain data class to interact with DDB
  */
  async _getDomain(domainKey: string): Promise<Domain> {
    const domain = await this._orbitNode.kvstore(domainKey);
    await domain.load();

    if (this._pinner) {
      await this._pinner.pin(domain);
    }

    return new Domane(domain);
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
    this.joinColony = this.joinColony.bind(this);
    this.loadColony = this.loadColony.bind(this);
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

  // Probably only used in testing
  async clear(rootRepo): Promise<void> {
    if (this._pinner) {
      this._pinner.stop();
    }

    await this.stop();
    await new Promise((resolve, reject) => {
      rimraf(
        rootRepo,
        {},
        err => (err ? reject(err) : resolve('cleared root repo', rootRepo)),
      );
    });
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
