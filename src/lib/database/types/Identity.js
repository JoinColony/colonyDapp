/* @flow */

import type { IdentityProvider } from './IdentityProvider';
import type { KeyPair } from './KeyPair';

type Signatures = {
  id: string, // The 'wallet signature' (the Ethereum account address, signed by Orbit's key)
  publicKey: string, // The opposite: the Orbit key's public key plus the previous signature (concatenated and signed)
};

export type IdentityObject = {
  id: string, // IPFS ID
  publicKey: string, // Orbit public key
  signatures: Signatures,
  type: string, // Provider type
};

export interface Identity {
  _id: string;

  _orbitKey: KeyPair;

  +_provider: IdentityProvider<Identity>;

  _publicKey: string;

  _signatures: Signatures;

  _type: string;

  get id(): string;

  get orbitKey(): KeyPair;

  get provider(): IdentityProvider<Identity>;

  toJSON(): IdentityObject;
}
