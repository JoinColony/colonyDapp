/* @flow */

import type { Entry } from '~types';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

/* eslint-disable class-methods-use-this, no-underscore-dangle */
const type = 'permissive';
export default class PermissiveAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  static get type() {
    return type;
  }

  async save() {
    return type;
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const isWalletSignatureValid = this.constructor._walletDidVerifyOrbitKey(
      entry,
    );
    if (!isWalletSignatureValid) return false;

    // Did the wallet allow the orbit key to write on its behalf and vice-versa?
    return this.constructor._providerDidVerifyEntry(provider, entry);
  }
}
/* eslint-enable class-methods-use-this, no-underscore-dangle */
