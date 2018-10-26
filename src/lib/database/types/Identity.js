/* @flow */

import type { IdentityProvider } from './IdentityProvider';
import type { KeyPair } from './KeyPair';

type Signatures = {
  id: string,
  publicKey: string,
};

export type IdentityObject = {
  id: string,
  publicKey: string,
  signatures: Signatures,
  type: string,
};

export interface Identity {
  _id: string;

  _orbitKey: KeyPair;

  +_provider: IdentityProvider;

  _publicKey: string;

  _signatures: Signatures;

  _type: string;

  get id(): string;

  get orbitKey(): KeyPair;

  get provider(): IdentityProvider;

  toJSON(): IdentityObject;
}
