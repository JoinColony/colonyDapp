/* eslint-disable class-methods-use-this */

import OrbitDBKeystore from 'orbit-db-keystore';
import localForage from 'localforage';
import { IdentityProvider } from './types';

import PurserIdentity from './PurserIdentity';
import { createAddress } from '../types';

// Ideally, we should use the actual type for the common wallet interface
type PurserWallet = any;

const PROVIDER_TYPE = 'ethereum';

class PurserIdentityProvider<I extends PurserIdentity>
  implements IdentityProvider<I> {
  private readonly options: object;

  private readonly localCache: LocalForage;

  private readonly wallet: PurserWallet;

  readonly keystore: OrbitDBKeystore;

  constructor(purserWallet: PurserWallet, options: object = {}) {
    if (!purserWallet.address) {
      throw new Error(
        'Could not create an identity provider, is the wallet unlocked?',
      );
    }

    this.options = options;
    this.wallet = purserWallet;
    this.keystore = OrbitDBKeystore.create(`./keystore/${this.walletAddress}`);
    this.localCache = localForage.createInstance({
      // Make sure it uses indexedDB
      driver: localForage.INDEXEDDB,
      name: 'purser-identity-cache',
      storeName: 'purser-identity-cache',
    });
  }

  get type() {
    return PROVIDER_TYPE;
  }

  get walletAddress() {
    return createAddress(this.wallet.address);
  }

  async createIdentity() {
    if (!this.wallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }

    let cachedIdentity: PurserIdentity | undefined;

    try {
      cachedIdentity = await this.localCache.getItem(this.walletAddress);
    } catch (e) {
      cachedIdentity = undefined;
      console.warn(
        `Could not initialize local storage. If we're not in a browser, that's fine.`,
        e,
      );
    }

    if (cachedIdentity) {
      return new PurserIdentity(
        cachedIdentity.id,
        cachedIdentity.publicKey,
        cachedIdentity.signatures.id,
        cachedIdentity.signatures.publicKey,
        cachedIdentity.type,
        this,
      );
    }

    // Always create a key per wallet address. This is stored on indexedDB
    const orbitKey =
      (await this.keystore.getKey(this.walletAddress)) ||
      (await this.keystore.createKey(this.walletAddress));

    // Sign wallet address with the orbit signing key we've created and are going to use
    const idSignature = await this.keystore.sign(orbitKey, this.walletAddress);

    // Get the public key
    const publicKey = this.keystore.getPublic(orbitKey);

    // Sign both the key and the signature created with that key
    const pubKeyIdSignature = await this.wallet.signMessage({
      message: publicKey + idSignature,
    });

    const identity = new PurserIdentity(
      this.walletAddress,
      publicKey,
      idSignature,
      pubKeyIdSignature,
      this.type,
      this,
    );
    try {
      await this.localCache.ready();
    } catch (e) {
      console.warn(
        `Could not initialize local storage. If we're not in a browser, that's fine.`,
        e,
      );
      return identity;
    }
    await this.localCache.setItem(this.walletAddress, identity.toJSON());
    return identity;
  }

  async sign(identity: PurserIdentity, data: any): Promise<string> {
    const signingKey = await this.keystore.getKey(identity.id);
    if (!signingKey)
      throw new Error(`Private signing key not found from Keystore`);
    return this.keystore.sign(signingKey, data);
  }

  async verify(
    signature: string,
    publicKey: string,
    data: any,
  ): Promise<boolean> {
    return this.keystore.verify(signature, publicKey, data);
  }

  async close() {
    // Make sure the keystore exists before trying to close it
    if (this.keystore) await this.keystore.close();
  }
}

export default PurserIdentityProvider;
