/* @flow */

import IPFS from 'ipfs';
import EventEmitter from 'events';
import type { StoreType } from './index';
import type { Identity } from '~types';

export interface OrbitDBStore {
  _oplog: {
    length: number,
  };
  address: { root: string, path: string };
  key: any;
  type: StoreType;
  replicationStatus: {
    buffered: number,
    queued: number,
    progress: number,
    max: number,
  };

  close: () => Promise<void>;

  events: EventEmitter;

  close: () => Promise<void>;

  constructor(
    ipfs: IPFS,
    identity: Identity,
    address: string,
    options: {},
  ): OrbitDBStore;

  load(): Promise<void>;
  load(amount: number): Promise<void>;

  drop(): Promise<void>;

  _addOperation(data: any): void;
}
