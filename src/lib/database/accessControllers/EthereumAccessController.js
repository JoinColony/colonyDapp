/* @flow */
/* eslint-disable no-underscore-dangle */

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

const PROVIDER_TYPE: 'ETHEREUM' = 'ETHEREUM';

class EthereumAccessController<
  I: PurserIdentity,
  P: PurserIdentityProvider<I>,
> extends AbstractAccessController<I, P> {
  _signingAddress: string;

  static get type() {
    return PROVIDER_TYPE;
  }

  constructor(signingAddress: string) {
    super();

    if (!signingAddress)
      throw new Error('Ethereum account address is required');

    this._signingAddress = signingAddress;
  }

  get signingAddress() {
    if (!this._signingAddress)
      throw new Error('Could not get wallet address. Is it unlocked?');

    return this._signingAddress;
  }

  async createManifest(ipfs: *, name: *, storeType: *) {
    return this.constructor._putManifest(ipfs, {
      name,
      type: storeType,
      account: `/${this.constructor.type}/${this.signingAddress}`,
    });
  }
}

export default EthereumAccessController;
