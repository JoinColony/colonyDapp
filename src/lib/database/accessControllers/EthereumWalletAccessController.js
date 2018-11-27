/* @flow */
/* eslint-disable no-underscore-dangle */

import type { AccessController, Entry } from '../types/index';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

// @FIXME: Use provider's type
const PROVIDER_TYPE: 'ETHEREUM_ACCOUNT' = 'ETHEREUM_ACCOUNT';

class EthereumWalletAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _walletAddress: string;

  static get type() {
    return PROVIDER_TYPE;
  }

  constructor(walletAddress: string) {
    super();
    this._walletAddress = walletAddress;
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const {
      identity: { id: walletAddress },
    } = entry;

    // @NOTE: This is only necessary for the EthereumWalletAccessController
    if (walletAddress !== this._walletAddress) return false;
    return super.canAppend(entry, provider);
  }

  async save() {
    // FIXME owner instead of type ?
    return `/${this.constructor.type}/${this._walletAddress}`;
  }

  async grant(actionId: string, address: string) {
    throw new Error(
      'The wallet owner is the only one allowed to write to this database',
    );
  }

  async revoke(actionId: string, address: string) {
    throw new Error(
      'The wallet owner is the only one allowed to write to this database',
    );
  }
}

export default EthereumWalletAccessController;
