/* @flow */
/* eslint-disable no-underscore-dangle */

import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import ColonyNetworkClient from '@colony/colony-js-client';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
/* eslint-disable max-len */
import AttributesBasedAccessController from '../../acl/AttributesBasedAccessController';
import type { PermissionsManifest } from '../../acl/AttributesBasedAccessController';
/* eslint-enable max-len */

const PROVIDER_TYPE: 'COLONY' = 'COLONY';

class ColonyAccessController<
  I: PurserIdentity,
  P: PurserIdentityProvider<I>,
> extends AbstractAccessController<I, P> {
  _purserWallet: WalletObjectType;

  _manifest: PermissionsManifest;

  _actions: Array<string>;

  _ABAC: AttributesBasedAccessController;

  _colonyClient: ColonyNetworkClient.ColonyClient;

  static get type() {
    return PROVIDER_TYPE;
  }

  constructor(
    colonyClient: ColonyNetworkClient.ColonyClient,
    purserWallet: WalletObjectType,
  ) {
    super();
    this._checkWalletAddress();
    this._colonyClient = colonyClient;
    this._purserWallet = purserWallet;
    this._manifest = this._createPermissionsManifest();
    this._ABAC = new AttributesBasedAccessController(this._manifest);
  }

  // eslint-disable-next-line class-methods-use-this
  _createPermissionsManifest(): PermissionsManifest {
    // TODO create real permissions manifest (based on the Colony contract)
    return {
      // eslint-disable-next-line no-unused-vars
      'dummy-permission': async (user, context) => true,
    };
  }

  _extendVerifyContext<Context: Object>(context: Context) {
    return { colonyAddress: this._colonyClient.contract.address, ...context };
  }

  _checkWalletAddress() {
    if (!this._purserWallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  get signingAddress() {
    this._checkWalletAddress();
    return this._purserWallet.address;
  }

  async can<Context: Object>(actionId: string, context: Context) {
    return this._ABAC.can(
      this.signingAddress,
      actionId,
      this._extendVerifyContext<Context>(context),
    );
  }

  async createManifest(ipfs: *, name: *, storeType: *) {
    const isAllowed = await this.can('create-colony-database', {});
    if (!isAllowed)
      throw new Error('Cannot create colony database, user not allowed');

    const signature = await this._purserWallet.signMessage({
      message: this.signingAddress,
    });

    return this.constructor._putManifest(ipfs, {
      name,
      type: storeType,
      signature,
      owner: this.signingAddress,
    });
  }

  async isAuthorized(entry: *, provider: *) {
    // TODO clarify what the intention is here.
    if (!(this._actions && this._actions.length))
      throw new Error('Could not load whitelisted addresses');

    if (!super.isAuthorized(entry, provider)) return false;

    const {
      payload: { value },
    } = entry;
    return this.can(value.__eventType, value);
  }
}

export default ColonyAccessController;
