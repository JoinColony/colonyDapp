/* @flow */
/* eslint-disable no-underscore-dangle */
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import type { PermissionsManifest } from './permissions/types';
import AbstractAccessController from './AbstractAccessController';

import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import PermissionManager from './PermissionManager';
import type { Entry } from '../types/index';

const TYPE = 'eth-contract/colony/purser';

class ColonyAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _colonyAddress: string;

  _manager: PermissionManager;

  _purserWallet: WalletObjectType;

  static get type() {
    return TYPE;
  }

  constructor(
    colonyAddress: string,
    purserWallet: WalletObjectType,
    permissionsManifest: PermissionsManifest,
  ) {
    super();
    this._colonyAddress = colonyAddress;
    this._purserWallet = purserWallet;
    this._manager = new PermissionManager(permissionsManifest);
  }

  _extendVerifyContext<Context: {}>(context: ?Context) {
    return Object.assign({}, context, { colonyAddress: this._colonyAddress });
  }

  _checkWalletAddress() {
    if (!this._purserWallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  async save() {
    const isAllowed = await this.can(
      'is-colony-founder',
      this._purserWallet.address,
    );
    if (!isAllowed)
      throw new Error('Cannot create colony database, user not allowed');

    const signingWalletAddress = this._purserWallet.address;
    const signature = await this._purserWallet.signMessage({
      message: this._colonyAddress + signingWalletAddress,
    });

    return `/colony/${
      this._colonyAddress
    }/creator/${signingWalletAddress}/${signature}`;
  }

  async setup() {
    this._checkWalletAddress();
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const isAuthorized = await super.canAppend(entry, provider);
    if (!isAuthorized) return false;

    // Is the wallet signature valid?
    const {
      payload: { value: event },
      identity: { id: user },
    } = entry;
    return this.can(event.type, user, event);
  }

  async can<Context: {}>(
    actionId: string,
    user: string,
    context: ?Context,
  ): Promise<boolean> {
    return this._manager.can(
      actionId,
      user,
      this._extendVerifyContext<Context>(context),
    );
  }
}

export default ColonyAccessController;
