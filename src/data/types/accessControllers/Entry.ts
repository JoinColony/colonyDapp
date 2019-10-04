import { IdentityObject } from './Identity';

interface LamportClock {
  id: string;
  time: number;
}

export interface Entry {
  hash: string; // IPFS hash of the entry
  id: string; // IPFS ID
  payload: { value: any }; // The operation payload
  next: string[]; // Array of the next IPFS hashes
  v: number; // Format version of the entry
  clock: LamportClock; // Used to order the operations
  sig: string; // The entry signature (signs everything but the hash)
  key: string; // Public key used to sign the data, hex encoded
  identity: IdentityObject; // The identity used to sign the entry
}
