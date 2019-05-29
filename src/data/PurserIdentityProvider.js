/* @flow */
/* eslint-disable class-methods-use-this */

import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import OrbitDBKeystore from 'orbit-db-keystore';
import type { IdentityProvider } from './types';

import PurserIdentity from './PurserIdentity';
import { createAddress } from '../types';

// Ideally, we should use the actual type for the common wallet interface
type PurserWallet = WalletObjectType;
type Options = {};
type ProviderType = 'ethereum';

const PROVIDER_TYPE = 'ethereum';

class PurserIdentityProvider<I: PurserIdentity> implements IdentityProvider<I> {
  _options: Options;

  _type: ProviderType;

  _keystore: OrbitDBKeystore;

  _purserWallet: PurserWallet;

  constructor(purserWallet: PurserWallet, options: Options = {}) {
    if (!purserWallet.address) {
      throw new Error(
        'Could not create an identity provider, is the wallet unlocked?',
      );
    }

    this._type = PROVIDER_TYPE;
    this._options = options;
    this._purserWallet = purserWallet;
    this._keystore = OrbitDBKeystore.create(`./keystore/${this.walletAddress}`);
  }

  get type() {
    return this._type;
  }

  get keystore() {
    return this._keystore;
  }

  get walletAddress() {
    return createAddress(this._purserWallet.address);
  }

  async createIdentity() {
    if (!this._purserWallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }

    // Make sure the keystore is open
    await this._keystore.open(this.walletAddress);
    // Always create a key per wallet address. This is stored on indexedDB
    const orbitKey =
      (await this._keystore.getKey(this.walletAddress)) ||
      (await this._keystore.createKey(this.walletAddress));

    // Sign wallet address with the orbit signing key we've created and are going to use
    const idSignature = await this._keystore.sign(orbitKey, this.walletAddress);

    // Get the public key
    const publicKey = this._keystore.getPublic(orbitKey);

    // Sign both the key and the signature created with that key
    const pubKeyIdSignature = await this._purserWallet.signMessage({
      message: publicKey + idSignature,
    });

    return new PurserIdentity(
      this.walletAddress,
      publicKey,
      idSignature,
      pubKeyIdSignature,
      this._type,
      this,
    );
  }

  async sign(identity: PurserIdentity, data: any): Promise<string> {
    // Make sure the keystore is open
    await this._keystore.open();
    const signingKey = await this._keystore.getKey(identity.id);
    if (!signingKey)
      throw new Error(`Private signing key not found from Keystore`);
    return this._keystore.sign(signingKey, data);
  }

  async verify(
    signature: string,
    publicKey: string,
    data: any,
  ): Promise<boolean> {
    // Make sure the keystore is open
    await this._keystore.open();
    return this._keystore.verify(signature, publicKey, data);
  }

  async close() {
    // Make sure the keystore exists before trying to close it
    if (this._keystore) await this._keystore.close();
  }
}

export default PurserIdentityProvider;
