/* @flow */

import IPFS from 'ipfs';

import type { Identity, IdentityObject } from './Identity';
import type { IdentityProvider } from './IdentityProvider';

type LamportClock = {
  id: string,
  time: number,
};

export type Entry = {
  hash: string, // IPFS hash of the entry
  id: string, // IPFS ID
  payload: Object, // The operation payload
  next: string[], // Array of the next IPFS hashes
  v: number, // Format version of the entry
  clock: LamportClock, // Used to order the operations
  sig: string, // The entry signature (signs everything but the hash)
  key: string, // Public key used to sign the data, hex encoded
  identity: IdentityObject, // The identity used to sign the entry
};

export interface AccessController<I: Identity, P: IdentityProvider<I>> {
  // static getter: `type: string`

  createManifest(ipfs: IPFS, name: string, type: string): Promise<string>;

  isAuthorized(entry: Entry, provider: P): Promise<boolean>;

  setup(): Promise<void>;

  grant(actionId: string, address: string): boolean;

  revoke(actionId: string, address: string): boolean;
}
