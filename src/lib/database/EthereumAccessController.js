/* @flow */
/* eslint-disable no-console, class-methods-use-this */

import { Wallet } from 'ethers';

import type { AccessController, Entry } from './types';

import PurserIdentity from './PurserIdentity';
import PurserIdentityProvider from './PurserIdentityProvider';

// TODO: Use actual type for common wallet interface
type ProviderType = 'ETHEREUM_ACCOUNT';
const PROVIDER_TYPE = 'ETHEREUM_ACCOUNT';

/**
 * Access controller for Purser based Ethereum wallets
 */
class EthereumAccessController
  implements
    AccessController<PurserIdentity, PurserIdentityProvider<PurserIdentity>> {
  _accountAddress: string;

  _type: ProviderType;

  constructor(accountAddress: string) {
    if (!accountAddress)
      throw new Error('Ethereum account address is required');
    this._accountAddress = accountAddress;
    this._type = PROVIDER_TYPE;
  }

  async save(): Promise<string> {
    if (!this._accountAddress) {
      throw new Error(
        'This access controller needs an account address to work',
      );
    }

    return `/ethereum/${this._accountAddress}`;
  }

  async canAppend(
    entry: Entry,
    provider: PurserIdentityProvider<PurserIdentity>,
  ): Promise<boolean> {
    const {
      identity: {
        id: walletAddress,
        publicKey: orbitPublicKey,
        signatures,
        type,
      },
    } = entry;

    if (walletAddress !== this._accountAddress) return false;
    if (type !== this._type) return false;

    const message = orbitPublicKey + signatures.id;
    const signature = signatures.publicKey;
    const signedAddress = Wallet.verifyMessage(message, signature);
    if (signedAddress.toLowerCase() !== this._accountAddress.toLowerCase()) {
      return false;
    }

    return provider.verify(signatures.id, orbitPublicKey, walletAddress);
  }

  /* eslint-disable no-unused-vars,class-methods-use-this */
  async setup() {
    /**
     * @TODO:
     * Do any sort of setup here, although this could just return true in the
     * abstract access controller. The ColonyAccessController would use it to
     * put the permission manifest together though
     */
    console.log('Implement me');
  }

  async grant(actionId: string, address: string) {
    throw new Error('Not implemented yet');
  }

  async revoke(actionId: string, address: string) {
    throw new Error('Not implemented yet');
  }
  /* eslint-enable no-unused-vars,class-methods-use-this */
}

export default EthereumAccessController;
