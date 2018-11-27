/* @flow */
/* eslint-disable no-underscore-dangle */
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import ColonyNetworkClient from '@colony/colony-js-client';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import PermissionManager from './PermissionManager';
import type { AccessController, Entry } from '../types/index';
import type { PermissionsManifest } from './PermissionManager';

const PROVIDER_TYPE: 'ETHEREUM_ACCOUNT' = 'ETHEREUM_ACCOUNT';

class ColonyAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _colonyAddress: string;

  _manager: PermissionManager;

  _purserWallet: WalletObjectType;

  static get type() {
    return PROVIDER_TYPE;
  }

  constructor(
    colonyAddress: string,
    purserWallet: WalletObjectType,
    permissionsManifest: PermissionsManifest,
  ) {
    super();
    this._colonyAddress = colonyAddress;
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
    return { colonyAddress: this._colonyAddress, ...context };
  }

  _checkWalletAddress() {
    if (!this._purserWallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  async save() {
    const isAllowed = await this.can('create-colony-database', {});
    if (!isAllowed)
      throw new Error('Cannot create colony database, user not allowed');

    const signingWalletAddress = this._purserWallet.address;
    const signature = await this._purserWallet.signMessage({
      message: signingWalletAddress,
    });

    return `/${this.constructor.type}/${signingWalletAddress}/${signature}`;
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const isAuthorized = await super.canAppend(entry, provider);
    if (!isAuthorized) return Promise.resolve(false);

    // Is the wallet signature valid?
    const {
      payload: { value },
    } = entry;
    return this.can(value.__eventType, value);
  }

  async can<Context: Object>(actionId: string, context: Context) {
    return this._manager.can(
      this._purserWallet.address,
      actionId,
      this._extendVerifyContext<Context>(context),
    );
  }
}

export default ColonyAccessController;
