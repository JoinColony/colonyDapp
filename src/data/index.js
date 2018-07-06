/* @flow */
import * as ipfs from './ipfs';
import { UserProfile, orbitSetup } from './orbit';
import type {
  B58String,
  Colony,
  ColonyIPFSNode,
  DataOptions,
  Domains,
  OrbitKVStore,
  OrbitNode,
  Pinner,
  Tasks,
} from './types';

type PublicKey = string;

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

  // colonyJS
  async getMetaColony(): Promise<MetaColony> {}

  // colonyJS
  // cache in OrbitDB
  async getColony(colonyId: colonyId): Promise<Colony> {}

  // OrbitDB, maybe UserProfile
  async getUserColonies(): Promise<ColonyAddresses> {}

  // colonyJS
  async getSkills(): Promise<SkillsTree> {}

  // colonyJS
  async getDomain(Domain): Promise<SkillsTree> {}

  // If not in OrbitDB, fetch and return from colonyJS, then cache in OrbitDB
  // If in OrbitDB, return from OrbitDB, then update from colonyJS
  async getTask(taskId): Promise<Task> {}

  // same
  async getTasks(taskId): Promise<Task> {}

  // IPFS
  async getTaskComments(taskId): Promise<Comments> {}

  async addComment({
    taskId,
    commentString,
    author,
    date,
  }): Promise<IPFShash> {}

  // Store in orbitDB
  // When submitted to a chain, replace in DDB with normal task
  async taskDraft(): taskDraft<Comments> {}
}
