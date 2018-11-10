/* @flow */

export type { AccessController, Entry } from './AccessController';
export type { Identity, IdentityObject } from './Identity';
export type { IdentityProvider } from './IdentityProvider';
export type { KeyPair } from './KeyPair';
export type { OrbitDBStore } from './OrbitDBStore';
export type { OrbitDBKVStore } from './OrbitDBKVStore';
export type { ENSResolverType } from './ENSResolver';

export type IPFSHash = string;

// TODO use yup's `object` type
export type Schema = Object;

// IPFS store types
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
