/* @flow */

import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import IPFS from 'ipfs';

import PurserIdentityProvider from './PurserIdentityProvider';

// TODO: Use actual type for common wallet interface
type PurserWallet = WalletObjectType;

type ProviderType = 'ETHEREUM_ACCOUNT';

const PROVIDER_TYPE = 'ETHEREUM_ACCOUNT';

/**
 * Access controller for Purser based Ethereum wallets
 */
class PurserAccessController {
  _purserWallet: PurserWallet;

  _type: ProviderType;

  constructor(purserWallet: PurserWallet) {
    this._purserWallet = purserWallet;
    this._type = PROVIDER_TYPE;

    if (!this._purserWallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }
  }

  async createManifest(ipfs: IPFS, name: string, type: ProviderType) {
    if (!this._purserWallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }

    const manifest = {
      name,
      type,
      account: `/ethereum/${this._purserWallet.address}`,
    };

    const dag = await ipfs.object.put(Buffer.from(JSON.stringify(manifest)));
    console.log('Manifest created', dag);
    return dag.toJSON().multihash.toString();
  }

  // TODO: type entry better
  async canAppend(entry: any, provider: PurserIdentityProvider) {
    const {
      identity: {
        id: walletAddress,
        publicKey: orbitPublicKey,
        signatures,
        type,
      },
    } = entry;

    if (walletAddress !== this._purserWallet.address) return false;
    if (type !== this._type) return false;

    const data = orbitPublicKey + signatures.id;
    const signature = signatures.publicKey;
    const isWalletSignatureValid = await this._purserWallet.verifyMessage({
      message: data,
      signature,
    });
    if (!isWalletSignatureValid) return false;

    return provider.verify(signatures.id, orbitPublicKey, walletAddress);
  }

  async load() {
    /* Implement me */
  }
}

export default PurserAccessController;
