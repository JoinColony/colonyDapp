/* @flow */
/* eslint-disable no-underscore-dangle */
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import type { PermissionsManifest } from './permissions/types';
import AbstractAccessController from './AbstractAccessController';

import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import PermissionManager from './PermissionManager';
import type { Entry } from '../types/index';

class TaskAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _colonyAddress: string;

  _manager: PermissionManager;

  _purserWallet: WalletObjectType;

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
    const isAllowed = await this.can('is-colony-founder-or-admin');
    if (!isAllowed)
      throw new Error('Cannot create colony database, user not allowed');

    const signingWalletAddress = this._purserWallet.address;
    const signature = await this._purserWallet.signMessage({
      message: signingWalletAddress,
    });

    return `/colony/${this._colonyAddress}/task/creator/${signingWalletAddress}/${signature}`;
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
    } = entry;
    return this.can(event.type, event);
  }

  async can<Context: {}>(
    actionId: string,
    context: ?Context,
  ): Promise<boolean> {
    return this._manager.can(
      this._purserWallet.address,
      actionId,
      this._extendVerifyContext<Context>(context),
    );
  }
}

export default TaskAccessController;
