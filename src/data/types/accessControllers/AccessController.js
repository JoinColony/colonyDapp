/* @flow */

import type { Address } from '~types';

import type { Identity } from './Identity';
import type { IdentityProvider } from './IdentityProvider';
import type { Entry } from './Entry';

export interface AccessController<I: Identity, P: IdentityProvider<I>> {
  +type: string;

  canAppend(entry: Entry, provider: P): Promise<boolean>;

  load(options: any): Promise<void>;

  save(options: any): Promise<string>;

  grant(actionId: string, address: Address): Promise<boolean>;

  revoke(actionId: string, address: Address): Promise<boolean>;
}
