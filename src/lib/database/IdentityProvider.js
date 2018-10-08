/* @flow */

import Keystore from 'orbit-db-keystore';

import type { Identity } from './Identity';

export interface IdentityProvider {
  _keystore: Keystore;

  +_type: string;

  createIdentity(): Promise<Identity>;

  sign<T: Identity>(identity: T, data: any): Promise<string>;

  verify(signature: string, publicKey: string, data: any): Promise<boolean>;
}
