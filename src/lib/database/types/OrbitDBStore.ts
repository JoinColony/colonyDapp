import IPFS from 'ipfs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { EventEmitter } from 'events';
import { StoreType } from './index';
import { Entry, Identity } from '~types/index';

type LoadOptions = {
  fetchEntryTimeout?: number;
};

export interface OrbitDBStore {
  _oplog: {
    length: number;
  };
  address: { root: string; path: string };
  key: any;
  type: StoreType;
  replicationStatus: {
    buffered: number;
    queued: number;
    progress: number;
    max: number;
  };
  events: EventEmitter;
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(
    ipfs: IPFS,
    identity: Identity,
    address: string,
    options: {},
  ): OrbitDBStore;
  load(): Promise<void>;
  load(amount: number): Promise<void>;
  load(amount: number, opts: LoadOptions): Promise<void>;
  close(): Promise<void>;
  drop(): Promise<void>;
  add(value: any): Promise<string>;
  get(hash: string): Entry;
  iterator(options: any): { collect: () => Entry[] };
  _addOperation(data: any): void;
}
