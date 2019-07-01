/* @flow */
/* eslint-disable no-underscore-dangle */

import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Entry, PermissionsManifest } from '../../types';

import { PermissionManager } from '../permissions';
import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import { createAddress } from '../../types';
import { log } from '../../utils/debug';

const TYPE = 'eth-contract/colony/task/purser';

class TaskAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _draftId: string;

  _colonyAddress: string;

  _manager: PermissionManager;

  _purserWallet: WalletObjectType;

  static get type() {
    return TYPE;
  }

  constructor(
    draftId: string,
    colonyAddress: string,
    purserWallet: WalletObjectType,
    permissionsManifest: PermissionsManifest,
  ) {
    super();
    this._draftId = draftId;
    this._colonyAddress = colonyAddress;
    this._purserWallet = purserWallet;
    log.verbose(
      'Instantiating task access controller',
      colonyAddress,
      draftId,
      purserWallet.address,
    );

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
      const isAllowed = await this.can(
        'is-colony-founder-or-admin',
        this.walletAddress,
      );
      if (!isAllowed) {
        throw new Error('Cannot create task database, user not allowed');
      }
    }

    // eslint-disable-next-line max-len
    const accessControllerAddress = `/colony/${this._colonyAddress}/task/${
      this._draftId
    }`;
    log.verbose(`Access controller address: "${accessControllerAddress}"`);
    return accessControllerAddress;
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
    log.verbose('Checking permission for action', actionId, user, context);
    return this._manager.can(
      actionId,
      user,
      this._extendVerifyContext<Context>(context),
    );
  }
}

export default TaskAccessController;
