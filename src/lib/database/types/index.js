/* @flow */

import type { ObjectSchema } from 'yup';

import { PurserIdentity, PurserIdentityProvider } from '..';
import type { AccessController } from './AccessController';
import type { Entry } from './Entry';

export type { AccessController, Entry };
export type { Identity, IdentityObject } from './Identity';
export type { IdentityProvider } from './IdentityProvider';
export type { OrbitDBStore } from './OrbitDBStore';
export type {
  EventIteratorOptions,
  OrbitDBEventStore,
} from './OrbitDBEventStore';

export type IPFSHash = string;

// IPFS store types
export type StoreType =
  | 'counter'
  | 'eventlog'
  | 'feed'
  | 'docstore'
  | 'keyvalue';

export type OrbitDBAddress = Object & {
  root: string,
  path: string,
};

export type OrbitStoreOpenOpts = {
  localOnly?: boolean,
  directory?: string,
  overwrite?: boolean,
  replicate?: boolean,
};

export type StoreBlueprint = {|
  defaultName?: string,
  schema?: ObjectSchema,
  getAccessController?: (
    storeProps: Object,
  ) => AccessController<PurserIdentity, PurserIdentityProvider<PurserIdentity>>,
  getName?: (args?: Object) => string,
  type: *,
|};

export type ResolverFn = (identifier: string) => Promise<?string>;
