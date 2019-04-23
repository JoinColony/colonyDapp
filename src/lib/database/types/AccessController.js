/* @flow */

import type { Identity } from './Identity';
import type { IdentityProvider } from './IdentityProvider';
import type { Entry } from './Entry';

export interface AccessController<I: Identity, P: IdentityProvider<I>> {
  +type: string;

  canAppend(entry: Entry, provider: P): Promise<boolean>;

  setup(options: any): Promise<void>;

  save(): Promise<string>;

  grant(actionId: string, address: string): Promise<boolean>;

  revoke(actionId: string, address: string): Promise<boolean>;
}
