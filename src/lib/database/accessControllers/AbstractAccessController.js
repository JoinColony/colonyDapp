/* @flow */
/* eslint-disable no-underscore-dangle */

import { Wallet } from 'ethers';

import type { AccessController, Entry } from '../types';

import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

/**
 * Abstract access controller class, for on Purser-based Ethereum wallets
 */
export default class AbstractAccessController<
  I: PurserIdentity,
  P: PurserIdentityProvider<I>,
> implements AccessController<I, P> {
  static _walletDidVerifyOrbitKey({
    identity: {
      id: walletAddress,
      publicKey: orbitPublicKey,
      signatures: { id, publicKey: signature },
    },
  }: Entry) {
    const message = orbitPublicKey + id;
    return AbstractAccessController.verifyWalletSignature(
      walletAddress,
      message,
      signature,
    );
  }

  static async _providerDidVerifyEntry(
    provider: P,
    {
      identity: { id: walletAddress, publicKey: orbitPublicKey, signatures },
    }: Entry,
  ): Promise<boolean> {
    return provider.verify(signatures.id, orbitPublicKey, walletAddress);
  }

  static verifyWalletSignature(
    walletAddress: string,
    message: string,
    signature: string,
  ) {
    return Wallet.verifyMessage(message, signature) === walletAddress;
  }

  static get type() {
    throw new Error('Not implemented');
  }

  get type() {
    return this.constructor.type;
  }

  /**
   * Necessary authorisation for all access controllers:
   * - The type of the entry should match
   * - The address signing the entry should match
   * - The signed message of the entry should be verified against the address
   * - The identity provider should have verified the entry
   */
  async canAppend(entry: Entry, provider: P): Promise<boolean> {
    const {
      identity: { type },
    } = entry;
    /**
     * @todo Add verbose mode for access controllers
     * @body Add logs here with debug so we have a verbose mode that gives us a clue on what's going on Is the entry identity type valid?
     */
    const isTypeValid = type === provider.type;
    if (!isTypeValid) return false;

    const isWalletSignatureValid = this.constructor._walletDidVerifyOrbitKey(
      entry,
    );
    if (!isWalletSignatureValid) return false;

    // Did the wallet allow the orbit key to write on its behalf and vice-versa?
    return this.constructor._providerDidVerifyEntry(provider, entry);
  }

  /* eslint-disable no-unused-vars,class-methods-use-this */
  async grant(actionId: string, address: string) {
    throw new Error('Not implemented');
  }

  async revoke(actionId: string, address: string) {
    throw new Error('Not implemented');
  }

  async save() {
    throw new Error('Not implemented');
  }

  // No setup required
  async setup() {
    return Promise.resolve();
  }

  static get type() {
    throw new Error('Not implemented');
  }
  /* eslint-enable no-unused-vars,class-methods-use-this */
}
