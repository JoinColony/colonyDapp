/* @flow */

import type { ObjectSchema } from 'yup';

import { PurserIdentity, PurserIdentityProvider } from '..';
import type { AccessController, Entry } from './AccessController';

export type { AccessController, Entry };
export type { Identity, IdentityObject } from './Identity';
export type { IdentityProvider } from './IdentityProvider';
export type { KeyPair } from './KeyPair';
export type { OrbitDBStore } from './OrbitDBStore';
export type { OrbitDBKVStore } from './OrbitDBKVStore';
export type { FeedIteratorOptions, OrbitDBFeedStore } from './OrbitDBFeedStore';
export type { ENSResolverType } from './ENSResolver';

export type IPFSHash = string;

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

export type OrbitStoreOpenOpts = {
  localOnly?: boolean,
  directory?: string,
  overwrite?: boolean,
  replicate?: boolean,
};

export type StoreBlueprint = {
  name: string,
  schema: ObjectSchema,
  getAccessController: (
    storeProps?: Object,
    // eslint-disable-next-line max-len, prettier/prettier
  ) => AccessController<PurserIdentity, PurserIdentityProvider<PurserIdentity>> | void,
  type: typeof Store,
};
