/* @flow */
/* eslint-disable no-underscore-dangle */

import { Wallet } from 'ethers';

import type { AccessController, Entry } from '../types/index';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

const PROVIDER_TYPE: 'ETHEREUM' = 'ETHEREUM';

class EthereumWalletAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  static get type() {
    return PROVIDER_TYPE;
  }

  _isEntrySignedMessageVerified(
    walletAddress: string,
    {
      identity: {
        publicKey: orbitPublicKey,
        signatures: { id, publicKey: signature },
      },
    }: Entry,
  ) {
    const message = orbitPublicKey + id;
    let signingWalletAddress = Wallet.verifyMessage(message, signature);
    signingWalletAddress = signingWalletAddress.toLowerCase();
    return signingWalletAddress === walletAddress;
  }

  async canAppend(entry: Entry, provider: P): Promise<boolean> {
    const {
      identity: { id: walletAddress },
    } = entry;

    const isAuthorized = await super.canAppend(entry, provider);
    if (!isAuthorized) return false;

    // @NOTE: This is only necessary for the EthereumWalletAccessController
    if (walletAddress !== this.walletAddress) return false;

    // Is the wallet signature valid?
    return this._isEntrySignedMessageVerified(entry);
  }

  async save() {
    // FIXME owner instead of type ?
    return `/${this.constructor.type}/${this.walletAddress}`;
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
