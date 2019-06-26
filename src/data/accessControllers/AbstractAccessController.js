/* @flow */
/* eslint-disable no-underscore-dangle */

import { Wallet } from 'ethers';

import type { AccessController, Address, Entry } from '../../types';

import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';
import { createAddress } from '../../types';
import { log } from '../../utils/debug';

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
    log.verbose('Verifying orbit public key signature using wallet');
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
    log.verbose(
      // eslint-disable-next-line max-len
      `Verifying wallet signature using orbit identity provider: "${walletAddress}"`,
    );
    return provider.verify(signatures.id, orbitPublicKey, walletAddress);
  }

  static verifyWalletSignature(
    walletAddress: string, // Likely to be an Address type, but might not be
    message: string,
    signature: string,
  ) {
    return (
      createAddress(Wallet.verifyMessage(message, signature)) ===
      createAddress(walletAddress)
    );
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
    log.verbose(
      `Checking permission before appending entry: ${entry && entry.hash}`,
    );

    const {
      identity: { type },
    } = entry;
    log.verbose(`Using identity type: ${type}`);

    const isTypeValid = type === provider.type;
    log.verbose('Is entry type valid?', isTypeValid);
    if (!isTypeValid) return false;

    const isWalletSignatureValid = this.constructor._walletDidVerifyOrbitKey(
      entry,
    );

    log.verbose('Is wallet signature valid?', isWalletSignatureValid);
    if (!isWalletSignatureValid) return false;

    // Did the wallet allow the orbit key to write on its behalf and vice-versa?
    // eslint-disable-next-line max-len
    const isOrbitSignatureValid = await this.constructor._providerDidVerifyEntry(
      provider,
      entry,
    );
    log.verbose('Is orbit signature valid?', isOrbitSignatureValid);

    return isOrbitSignatureValid;
  }

  /* eslint-disable no-unused-vars,class-methods-use-this */
  async grant(actionId: string, address: Address) {
    throw new Error('Not implemented');
  }

  async revoke(actionId: string, address: Address) {
    throw new Error('Not implemented');
  }

  async save(options: any) {
    throw new Error('Not implemented');
  }

  async close() {
    return Promise.resolve();
  }

  // No setup required
  async load() {
    return Promise.resolve();
  }
  /* eslint-enable no-unused-vars,class-methods-use-this */
}
