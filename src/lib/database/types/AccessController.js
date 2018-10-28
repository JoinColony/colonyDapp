/* @flow */

import IPFS from 'ipfs';

import type { Identity, IdentityObject } from './Identity';
import type { IdentityProvider } from './IdentityProvider';

type LamportClock = {
  id: string,
  time: number,
};

export type Entry = {
  hash: string,
  id: string,
  payload: Object,
  next: string[],
  v: number,
  clock: LamportClock,
  sig: string,
  key: string,
  identity: IdentityObject,
};

export interface AccessController<I: Identity, P: IdentityProvider<I>> {
  +_type: string;

  createManifest(ipfs: IPFS, name: string, type: string): Promise<string>;

  canAppend(entry: Entry, provider: P): Promise<boolean>;

  load(): Promise<void>;
}
