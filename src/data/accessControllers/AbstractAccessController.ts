/* eslint-disable no-underscore-dangle */

import { Wallet } from 'ethers';

import {
  AccessController,
  Address,
  Entry,
  createAddress,
} from '../../types/index';

import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

import { log } from '../../utils/debug';

/**
 * Abstract access controller class, for on Purser-based Ethereum wallets
 */
export default class AbstractAccessController<
  I extends PurserIdentity,
  P extends PurserIdentityProvider<I>
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

  static async _providerDidVerifyEntry<P extends PurserIdentityProvider<any>>(
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

  static get type(): string {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): string {
    return AbstractAccessController.type;
  }

  /**
   * Necessary authorisation for all access controllers:
   * - The type of the entry should match
   * - The address signing the entry should match
   * - The signed message of the entry should be verified against the address
   * - The identity provider should have verified the entry
   */
  // eslint-disable-next-line class-methods-use-this
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

    // eslint-disable-next-line max-len
    const isWalletSignatureValid = AbstractAccessController._walletDidVerifyOrbitKey(
      entry,
    );

    log.verbose('Is wallet signature valid?', isWalletSignatureValid);
    if (!isWalletSignatureValid) return false;

    // Did the wallet allow the orbit key to write on its behalf and vice-versa?
    // eslint-disable-next-line max-len
    const isOrbitSignatureValid: boolean = await AbstractAccessController._providerDidVerifyEntry(
      provider,
      entry,
    );
    log.verbose('Is orbit signature valid?', isOrbitSignatureValid);

    return isOrbitSignatureValid;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async grant(actionId: string, address: Address): Promise<boolean> {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async revoke(actionId: string, address: Address): Promise<boolean> {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async save(options: any): Promise<string> {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  async close() {
    return Promise.resolve();
  }

  // No setup required
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async load(options: any): Promise<void> {
    return Promise.resolve();
  }
}
