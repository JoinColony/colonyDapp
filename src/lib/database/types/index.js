/* @flow */

export type { AccessController, Entry } from './AccessController';
export type { Identity, IdentityObject } from './Identity';
export type { IdentityProvider } from './IdentityProvider';
export type { KeyPair } from './KeyPair';
export type { OrbitDBStore } from './OrbitDBStore';
export type { OrbitDBKVStore } from './OrbitDBKVStore';
export type { OrbitDBFeedStore } from './OrbitDBFeedStore';
export type { ENSResolverType } from './ENSResolver';

export type Schema = {
  [string]: any,
};

export type IPFSHash = string;

export type StoreType =
  | 'counter'
  | 'eventlog'
  | 'feed'
  | 'docstore'
  | 'keyvalue';

export type OrbitDBAddress = {
  root: string,
  path: string,
};
