/* @flow */
/* eslint-disable no-underscore-dangle */
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Entry, PermissionsManifest } from '../../types';

import { createAddress } from '../../types';

import { PermissionManager } from '../permissions';
import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

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

  get walletAddress() {
    return createAddress(this._purserWallet.address);
  }

  _extendVerifyContext<Context: {}>(context: ?Context) {
    return Object.assign({}, context, { colonyAddress: this._colonyAddress });
  }

  _checkWalletAddress() {
    if (!this._purserWallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  async save({ onlyDetermineAddress }: { onlyDetermineAddress: boolean }) {
    if (!onlyDetermineAddress) {
      const isAllowed = await this.can('is-colony-founder', this.walletAddress);
      if (!isAllowed) {
        throw new Error('Cannot create colony database, user not allowed');
      }
    }

    return `/colony/${this._colonyAddress}`;
  }

  async load() {
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
