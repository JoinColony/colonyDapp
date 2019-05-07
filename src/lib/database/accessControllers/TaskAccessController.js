/* @flow */
/* eslint-disable no-underscore-dangle */
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Entry } from '../types/index';
import type { PermissionsManifest } from './permissions/types';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import PermissionManager from './PermissionManager';

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
    // eslint-disable-next-line no-unused-vars
    const isAllowed = await this.can(
      'is-colony-founder-or-admin',
      this._purserWallet.address,
    );
    /**
     * @todo Fix task access controller saving for non-creators
     * @body `TaskAccessController.save()` is being called by non-task creators, and failing. Re-enable it and ensure save() is called correctly.
     */
    // if (!isAllowed)
    //   throw new Error('Cannot create task database, user not allowed');

    return `/colony/${this._colonyAddress}/task/${this._draftId}`;
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

export default TaskAccessController;
