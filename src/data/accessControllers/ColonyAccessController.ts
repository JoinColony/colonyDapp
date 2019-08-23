/* eslint-disable no-underscore-dangle */
import { WalletObjectType } from '@colony/purser-core';
import { Entry, PermissionsManifest, createAddress } from '../../types/index';

import { log } from '../../utils/debug';

import { PermissionManager } from '../permissions';
import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

const TYPE = 'eth-contract/colony/purser';

class ColonyAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>
> {
  _colonyAddress: string;

  _manager: PermissionManager;

  _purserWallet: WalletObjectType;

  static get type(): string {
    return TYPE;
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): string {
    return ColonyAccessController.type;
  }

  constructor(
    colonyAddress: string,
    purserWallet: WalletObjectType,
    permissionsManifest: PermissionsManifest,
  ) {
    super();

    log.verbose(
      'Instantiating colony access controller',
      colonyAddress,
      purserWallet.address,
    );
    this._colonyAddress = colonyAddress;
    this._purserWallet = purserWallet;
    this._manager = new PermissionManager(permissionsManifest);
  }

  get walletAddress() {
    return createAddress(this._purserWallet.address);
  }

  _extendVerifyContext<Context extends {}>(context: Context | null) {
    return { ...context, colonyAddress: this._colonyAddress };
  }

  _checkWalletAddress() {
    if (!this._purserWallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  async save({ onlyDetermineAddress }: { onlyDetermineAddress: boolean }) {
    if (!onlyDetermineAddress) {
      const isAllowed = await this.can(
        'is-colony-founder',
        this.walletAddress,
        {},
      );
      if (!isAllowed) {
        throw new Error('Cannot create colony database, user not allowed');
      }
    }

    const accessControllerAddress = `/colony/${this._colonyAddress}`;
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

  async can<Context extends {}>(
    actionId: string,
    user: string,
    context: Context | null,
  ): Promise<boolean> {
    log.verbose('Checking permission for action', actionId, user, context);
    return this._manager.can(
      actionId,
      user,
      this._extendVerifyContext<Context>(context),
    );
  }
}

export default ColonyAccessController;
