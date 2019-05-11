/* @flow */
/* eslint-disable no-underscore-dangle */
import type { Entry } from '~types';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

const TYPE = 'eth-wallet/purser';

class EthereumWalletAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _walletAddress: string;

  static get type() {
    return TYPE;
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
    return `/ethereum_account/${this._walletAddress}`;
  }

  /* eslint-disable no-unused-vars,class-methods-use-this */
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
  /* eslint-enable no-unused-vars,class-methods-use-this */
}

export default EthereumWalletAccessController;
