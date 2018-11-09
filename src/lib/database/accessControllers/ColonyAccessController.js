/* @flow */
/* eslint-disable no-underscore-dangle */

import { Wallet } from 'ethers';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import ColonyNetworkClient from '@colony/colony-js-client';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import PermissionManager from './PermissionManager';
import type { AccessController, Entry } from '../types/index';
import type { PermissionsManifest } from './PermissionManager';

const PROVIDER_TYPE: 'COLONY' = 'COLONY';

class ColonyAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _purserWallet: WalletObjectType;

  _manager: PermissionManager;

  static get type() {
    return PROVIDER_TYPE;
  }

  constructor(
    purserWallet: WalletObjectType,
    permissionsManifest: PermissionsManifest,
  ) {
    super();
    this._purserWallet = purserWallet;
    this._manager = new PermissionManager(
      // permissionsManifest
      {
        // eslint-disable-next-line no-unused-vars
        'dummy-permission': async (user, context) => true,
      },
    );

    this._checkWalletAddress();
  }

  _extendVerifyContext<Context: Object>(context: Context) {
    return { colonyAddress: this._colonyClient.contract.address, ...context };
  }

  _checkWalletAddress() {
    if (!this._purserWallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  async save() {
    const isAllowed = await this.can('create-colony-database', {});
    if (!isAllowed)
      throw new Error('Cannot create colony database, user not allowed');

    const signature = await this._purserWallet.signMessage({
      message: this.purserWallet.address,
    });

    return `/${this.constructor.type}/${this.signingAddress}/${signature}`;
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
    const isAuthorized = await super.canAppend(entry, provider);
    if (!isAuthorized) return false;

    // Is the wallet signature valid?
    const isWalletSignatureValid = await this._isEntrySignedMessageVerified(
      entry,
    );
    if (!isWalletSignatureValid) return false;

    const {
      payload: { value },
    } = entry;
    return this.can(value.__eventType, value);
  }

  async can<Context: Object>(actionId: string, context: Context) {
    return this._manager.can(
      this.purserWallet.address,
      actionId,
      this._extendVerifyContext<Context>(context),
    );
  }
}

export default ColonyAccessController;
