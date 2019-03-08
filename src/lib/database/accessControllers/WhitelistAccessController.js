/* @flow */
/* eslint-disable no-underscore-dangle */

import assert from 'assert';

import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import type { Entry, OrbitDBKVStore } from '../types';

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

// TODO: Use provider's type
const PROVIDER_TYPE: 'ETHEREUM_ACCOUNT' = 'ETHEREUM_ACCOUNT';
const WHITELIST = '__WHITELIST';
const DATA = '__DATA';

class WhitelistAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  _inboxOwnerAddress: string;

  _purserWallet: WalletObjectType;

  _whitelist: Map<string, string>;

  static get type() {
    return PROVIDER_TYPE;
  }

  constructor(
    purserWallet: WalletObjectType,
    inboxOwnerAddress: string,
    whitelist: Map<string, string>,
  ) {
    super();
    // TODO make sure the wallet is unlocked
    this._purserWallet = purserWallet;
    // TODO get the inbox owner from the manifest
    this._inboxOwnerAddress = inboxOwnerAddress;
    // TODO Retrieve the whitelist from the store or a contract
    this._whitelist = whitelist;
  }

  _checkWalletAddress() {
    if (!this._purserWallet.address)
      throw new Error('Could not get wallet address. Is it unlocked?');
  }

  async _canModifyWhitelist(accountAddress: string) {
    // TODO: check against store manifest
    return accountAddress === this._inboxOwnerAddress;
  }

  async _isAllowedToWrite(accountAddress: string) {
    const authorization =
      this._whitelist && this._whitelist.get(accountAddress);
    if (!authorization)
      throw new Error('Account is not allowed to write to the inbox');

    return this.constructor.verifyWalletSignature(
      this._inboxOwnerAddress,
      accountAddress,
      authorization,
    );
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    if (!(this._whitelist && this._whitelist.size))
      throw new Error('Could not load whitelisted addresses');

    const isAuthorized = await super.canAppend(entry, provider);
    if (!isAuthorized) return false;

    const {
      payload: { key },
      identity: { id: accountAddress },
    } = entry;

    if (key === WHITELIST) return this._canModifyWhitelist(accountAddress);
    if (key === DATA) return this._isAllowedToWrite(accountAddress);
    return false;
  }

  async save(): Promise<string> {
    return `/${this.constructor.type}/inbox/${this._purserWallet.address}`;
  }

  async setup({ whitelist }: any) {
    this._whitelist = whitelist; // TODO: Load from a contract?
    this._checkWalletAddress();
  }

  async addToWhitelist(store: OrbitDBKVStore, accountAddress: string) {
    // TODO verify if the current wallet is in fact the inbox owner
    assert(
      this._purserWallet.address === this._inboxOwnerAddress,
      'Only the inbox owner is allowed to change the whitelist',
    );

    const whitelist = await store.get(WHITELIST);
    const signature = await this._purserWallet.signMessage({
      message: accountAddress,
    });

    whitelist[accountAddress] = signature;
    return store.put(WHITELIST, whitelist);
  }

  async removeFromWhitelist(store: OrbitDBKVStore, accountAddress: string) {
    // TODO verify if the current wallet is in fact the inbox owner
    assert(
      this._purserWallet.address === this._inboxOwnerAddress,
      'Only the inbox owner is allowed to change the whitelist',
    );

    const whitelist = await store.get(WHITELIST);
    delete whitelist[accountAddress];
    return store.put(WHITELIST, whitelist);
  }
}

export default WhitelistAccessController;
