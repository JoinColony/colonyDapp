/* @flow */

import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import Keystore from 'orbit-db-keystore';

import type { IdentityProvider } from './types';

import PurserIdentity from './PurserIdentity';

// TODO: Use actual type for common wallet interface
type PurserWallet = WalletObjectType;

type Options = {};

type ProviderType = 'ETHEREUM_ACCOUNT';

const PROVIDER_TYPE = 'ETHEREUM_ACCOUNT';

class PurserIdentityProvider implements IdentityProvider {
  _keystore: Keystore;

  _options: Options;

  _type: ProviderType;

  _purserWallet: PurserWallet;

  constructor(purserWallet: PurserWallet, options: Options = {}) {
    // TODO: Assumption that creating a keystore like this is always OK
    this._keystore = Keystore.create();
    this._options = options;
    // TOOD: Make sure wallet is unlocked when creating an identity
    this._purserWallet = purserWallet;
    this._type = PROVIDER_TYPE;
  }

  async createIdentity(): Promise<PurserIdentity> {
    const walletAddress = this._purserWallet.address;
    if (!walletAddress) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }
    // Get the key for id from the keystore or create one
    // if it doesn't exist
    const key =
      (await this._keystore.getKey(walletAddress)) ||
      (await this._keystore.createKey(walletAddress));

    // Sign the id with the signing key we're going to use
    const idSignature = await this._keystore.sign(key, walletAddress);

    // Get the hex string of the public key
    const publicKey = key.getPublic('hex');

    // Sign both the key and the signature created with that key
    const pubKeyIdSignature = await this._purserWallet.signMessage({
      message: publicKey + idSignature,
    });

    return new PurserIdentity(
      walletAddress,
      publicKey,
      idSignature,
      pubKeyIdSignature,
      this._type,
      this,
    );
  }

  // TODO: It's this issue that we need to solve: https://flow.org/try/#0PQKgBAAgZgNg9gdzCYAoVBLAdgFwKYBOUAhgMZ5gCSAQmAN6pgCQUccAFMQFxUCCAlDwDOOAtgDmAblQBfdNnxEyFSr3qomAagD6AIx41pc1KRjEhQsGowBbAA4w8NvLkur1TPT2pH0p85a0tg5OLjhutAwsbJw8AupgiUkEeDgArgRYYADkrHDZ0klgcnJAA
  // $FlowFixMe
  async sign(identity: PurserIdentity, data: any): Promise<string> {
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
    return this._keystore.verify(signature, publicKey, data);
  }
}

export default PurserIdentityProvider;
