import { Entry } from '~types/index';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

/* eslint-disable class-methods-use-this, no-underscore-dangle */
const TYPE = 'permissive';

export default class PermissiveAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>
> {
  static get type(): string {
    return TYPE;
  }

  get type(): string {
    return PermissiveAccessController.type;
  }

  async save() {
    return TYPE;
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const isWalletSigValid = AbstractAccessController._walletDidVerifyOrbitKey(
      entry,
    );
    if (!isWalletSigValid) return false;

    // Did the wallet allow the orbit key to write on its behalf and vice-versa?
    return AbstractAccessController._providerDidVerifyEntry(provider, entry);
  }
}
/* eslint-enable class-methods-use-this, no-underscore-dangle */
