/* @flow */
/* eslint-disable no-underscore-dangle */

import type { Address, Entry } from '~types';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import { createAddress } from '../../types';
import { log } from '../../utils/debug';

const TYPE = 'eth-wallet/purser';

class EthereumWalletAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _walletAddress: Address;

  static get type() {
    return TYPE;
  }

  constructor(walletAddress: Address) {
    super();
    log.verbose('Instantiating wallet access controller', walletAddress);
    this._walletAddress = walletAddress;
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const {
      identity: { id: walletAddress },
    } = entry;

    log.verbose(`Checking permission for wallet: "${walletAddress}"`);
    // @NOTE: This is only necessary for the EthereumWalletAccessController
    if (!createAddress(walletAddress) === this._walletAddress) return false;
    return super.canAppend(entry, provider);
  }

  async save() {
    const accessControllerAddress = `/ethereum_account/${this._walletAddress}`;
    log.verbose(`Access controller address: "${accessControllerAddress}"`);
    return accessControllerAddress;
  }

  /* eslint-disable no-unused-vars,class-methods-use-this */
  async grant(actionId: string, address: Address) {
    throw new Error(
      'The wallet owner is the only one allowed to write to this database',
    );
  }

  async revoke(actionId: string, address: Address) {
    throw new Error(
      'The wallet owner is the only one allowed to write to this database',
    );
  }
  /* eslint-enable no-unused-vars,class-methods-use-this */
}

export default EthereumWalletAccessController;
