import { Address } from '~types/index';

import { Identity } from './Identity';
import { IdentityProvider } from './IdentityProvider';
import { Entry } from './Entry';

export interface AccessController<
  I extends Identity,
  P extends IdentityProvider<I>
> {
  readonly type: string;
  canAppend(entry: Entry, provider: P): Promise<boolean>;
  load(options: any): Promise<void>;
  save(options: any): Promise<string>;
  grant(actionId: string, address: Address): Promise<boolean>;
  revoke(actionId: string, address: Address): Promise<boolean>;
}
