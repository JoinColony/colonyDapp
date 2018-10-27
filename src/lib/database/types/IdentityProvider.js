/* @flow */

import type { Identity } from './Identity';

export interface IdentityProvider {
  +_type: string;

  createIdentity(): Promise<Identity>;

  sign<T: Identity>(identity: T, data: any): Promise<string>;

  verify(signature: string, publicKey: string, data: any): Promise<boolean>;
}
