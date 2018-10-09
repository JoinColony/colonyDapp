/* @flow */

import IPFS from 'ipfs';
import EventEmitter from 'events';
import type { Identity } from './Identity';

export interface OrbitDBStore {
  address: { root: string, path: string };
  key: any;
  type: string;
  replicationStatus: {
    buffered: number,
    queued: number,
    progress: number,
    max: number,
  };

  events: EventEmitter;

  constructor(
    ipfs: IPFS,
    identity: Identity,
    address: string,
    options: {},
  ): OrbitDBStore;

  load(): Promise<void>;
  load(smount: number): Promise<void>;

  close(): Promise<void>;
  drop(): Promise<void>;

  _addOperation(data: any): void;
}
