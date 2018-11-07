/* @flow */
/* eslint-disable no-underscore-dangle */

import IPFS from 'ipfs';
import { Wallet } from 'ethers';

import type { AccessController, Entry } from '../types/index';

import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

/**
 * Abstract access controller class, for on Purser-based Ethereum wallets
 */
export default class AbstractAccessController<
  I: PurserIdentity,
  P: PurserIdentityProvider<I>,
> implements AccessController<I, P> {
  static get type(): string {
    throw new Error('Not implemented');
  }

  static async _putManifest(ipfs: IPFS, manifest: Object): Promise<string> {
    const dag = await ipfs.object.put(Buffer.from(JSON.stringify(manifest)));
    return dag.toJSON().multihash.toString();
  }

  static async _providerDidVerifyEntry(
    provider: P,
    {
      identity: { id: signingAddress, publicKey: orbitPublicKey, signatures },
    }: Entry,
  ): Promise<boolean> {
    return provider.verify(signatures.id, orbitPublicKey, signingAddress);
  }

  _isEntrySignedMessageVerified({
    identity: {
      publicKey: orbitPublicKey,
      signatures: { id, publicKey: signature },
    },
  }: Entry) {
    const message = orbitPublicKey + id;
    return Wallet.verifyMessage(message, signature) === this.signingAddress;
  }

  /**
   * Necessary authorisation for all access controllers:
   * - The type of the entry should match
   * - The address signing the entry should match
   * - The signed message of the entry should be verified against the address
   * - The identity provider should have verified the entry
   */
  async isAuthorized(entry: Entry, provider: P): Promise<boolean> {
    const {
      identity: { id: signingAddress, type },
    } = entry;
    return (
      type === this.constructor.type &&
      signingAddress === this.signingAddress &&
      this._isEntrySignedMessageVerified(entry) &&
      this.constructor._providerDidVerifyEntry(provider, entry)
    );
  }

  /* eslint-disable no-unused-vars,class-methods-use-this */
  get signingAddress(): string {
    throw new Error('Not implemented');
  }

  async createManifest(
    ipfs: IPFS,
    name: string,
    storeType: string,
  ): Promise<string> {
    throw new Error('Not implemented');
  }

  grant(actionId: string, address: string) {
    throw new Error('Not implemented');
  }

  revoke(actionId: string, address: string) {
    throw new Error('Not implemented');
  }

  async setup() {
    // No setup necessary for the abstract class
  }
  /* eslint-enable no-unused-vars,class-methods-use-this */
}
