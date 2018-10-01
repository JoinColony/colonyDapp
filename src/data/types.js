/* @flow */
import type { IPFS } from 'ipfs';
import type PeerInfo from 'peer-info';
import type MultiAddr from 'multiaddr';
import OrbitDB from 'orbit-db';

import { STATE_NOTHING, STATE_LOADING, STATE_READY } from './actions';

export type { Store as OrbitStore } from 'orbit-db-store';
export type { KeyValueStore as OrbitKVStore } from 'orbit-db-kvstore';

export type B58String = string;

export type IPFSOptions = {};

type IPFSSwarmAddress = string;
type IPFSBootstrapAddress = string;
type path = string;
export type PublicKey = string;

export type ColonyAddress = string;
export type DomainAddress = string;
export type IPFSHash = string;

export type ColonyIPFSOptions = {
  swarm?: IPFSSwarmAddress[],
  bootstrap?: IPFSBootstrapAddress[],
  repo?: path,
};

export type IPFSNode = IPFS;

export type ColonyIPFSNode = IPFSNode & {
  ready: () => Promise<boolean>,
};

export type IPFSPeer = {
  addr: MultiAddr,
  peer: PeerInfo,
};

export type ColonyOrbitOptions = { repo?: string };

export type OrbitOptions = {};

export type DataOptions = {
  ipfs: ColonyIPFSOptions,
  orbit: ColonyOrbitOptions,
};

export type OrbitNode = OrbitDB;

export type StoreAddress = string;

export type Pinner = { pin: StoreAddress => Promise<void> };

export type Token = {
  name: string,
  symbol: string,
  decimals: string,
  amount: number,
};

type Pot = {
  domain: string,
  tokenTypes: string[],
  funds: { [name: string]: Token },
};

export type Task = {
  spec: IPFSHash,
  dueDate: Date,
  title: string,
  comments: IPFSHash[],
  taskLabels: string[],
  taskSkills: string[],
  tags: string[],
  createdAt: Date,
  assignedTo: string,
  bounty: number,
  createdBy: string,
  _id: string,
};

export type Domain = {
  name: string,
  color: string,
  addTask: Function,
  addComment: Function,
  getTasks: Function,
  tasks: Task[],
  pot: Pot,
};

export type User = {
  name: string,
  email: string,
  bio: string,
  colonies: ColonyAddress[],
  reputation: number[],
};

export type Colony = {
  id: string,
  name: string,
  Domains: Domain[],
  Members: User[],
  pot: Pot,
  avatar: IPFSHash,
  setAvatar: Function,
  addMember: Function,
  getMembers: Function,
};

export type profileColony = {
  colonyDBAddress: ColonyAddress,
  colonyAvatarHash: IPFSHash,
  colonyTitle: string,
};

export type profileTask = {
  workerAvatarHash: IPFSHash,
  domainDbAddress: DomainAddress,
  myTaskRole: string,
  taskTitle: string,
  colonyTitle: string,
};

export type UserProfileType = {
  name: string,
  bio: string,
  avatar: IPFSHash,
  colonies: profileColony[],
  tasks: profileTask[],
  initialized: boolean,
};

type State =
  | typeof STATE_NOTHING
  | typeof STATE_LOADING
  | typeof STATE_READY
  | { my_profile: {} | string };

export type DataReduxStore = {
  state: State,
  data: any, // @TODO
};

export const INITIAL_STATE: DataReduxStore = {
  state: STATE_NOTHING,
  data: {
    colonies: { mycolony: { domains: [] } },
    domains: { mydomain: { tasks: [] } },
    profiles: {},
  },
};

export type Action = { type: string, payload: any };
