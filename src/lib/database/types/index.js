/* @flow */

import type { ObjectSchema } from 'yup';

import { PurserIdentity, PurserIdentityProvider } from '..';
import type { AccessController, Entry } from './AccessController';

import { Store } from '../stores';

export type { AccessController, Entry };
export type { Identity, IdentityObject } from './Identity';
export type { IdentityProvider } from './IdentityProvider';
export type { KeyPair } from './KeyPair';
export type { OrbitDBStore } from './OrbitDBStore';
export type { OrbitDBKVStore } from './OrbitDBKVStore';
export type { OrbitDBDocStore, QueryFunction } from './OrbitDBDocStore';
export type { FeedIteratorOptions, OrbitDBFeedStore } from './OrbitDBFeedStore';
export type {
  EventIteratorOptions,
  OrbitDBEventStore,
} from './OrbitDBEventStore';
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
  signature: string,
};

export type OrbitStoreOpenOpts = {
  localOnly?: boolean,
  directory?: string,
  overwrite?: boolean,
  replicate?: boolean,
};

export type StoreBlueprint = {
  name: string,
  schema?: ObjectSchema,
  getAccessController?: (
    storeProps?: Object,
  ) => AccessController<PurserIdentity, PurserIdentityProvider<PurserIdentity>>,
  type: typeof Store,
};
