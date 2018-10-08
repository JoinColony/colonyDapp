/* @flow */

import type { IdentityProvider } from './IdentityProvider';

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

  +_provider: IdentityProvider;

  _publicKey: string;

  _signatures: Signatures;

  _type: string;

  get id(): string;

  get provider(): IdentityProvider;

  toJSON(): IdentityObject;
}
