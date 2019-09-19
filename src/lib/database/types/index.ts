export { OrbitDBStore } from './OrbitDBStore';
export { EventIteratorOptions, OrbitDBEventStore } from './OrbitDBEventStore';

export type IPFSHash = string;

// IPFS store types
export type StoreType =
  | 'counter'
  | 'eventlog'
  | 'feed'
  | 'docstore'
  | 'keyvalue';

export type OrbitDBAddress = object & {
  root: string;
  path: string;
};

export type OrbitStoreOpenOpts = {
  localOnly?: boolean;
  directory?: string;
  overwrite?: boolean;
  replicate?: boolean;
};

export type ResolverFn = (identifier: string) => Promise<string | undefined>;
