/* @flow */
import type { IPFS } from 'ipfs';
import type PeerInfo from 'peer-info';
import type MultiAddr from 'multiaddr';
import OrbitDB from 'orbit-db';

export type { Store as OrbitStore } from 'orbit-db-store';
export type { KeyValueStore as OrbitKVStore } from 'orbit-db-kvstore';

export type B58String = string;

export type IPFSOptions = {};

type IPFSSwarmAddress = string;
type IPFSBootstrapAddress = string;
type path = string;

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
export type Pinner = { pinKVStore: StoreAddress => void };
