/* @flow */

import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import IPFS from 'ipfs';
import { utils } from 'ethers';

import type { AccessController, Entry } from './types';

import PurserIdentityProvider from './PurserIdentityProvider';

// TODO: Use actual type for common wallet interface
type PurserWallet = WalletObjectType;
type ProviderType = 'ETHEREUM_ACCOUNT';

const PROVIDER_TYPE = 'ETHEREUM_ACCOUNT';

/**
 * Access controller for Purser based Ethereum wallets
 */
class EthereumAccessController implements AccessController {
  _wallet: PurserWallet;

  _type: ProviderType;

  constructor(wallet: PurserWallet) {
    this._wallet = wallet;
    this._type = PROVIDER_TYPE;

    if (!this._wallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }
  }

  async createManifest(
    ipfs: IPFS,
    name: string,
    storeType: string,
  ): Promise<string> {
    if (!this._wallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }

    const manifest = {
      name,
      type: storeType,
      account: `/ethereum/${this._wallet.address}`,
    };

    const dag = await ipfs.object.put(Buffer.from(JSON.stringify(manifest)));
    return dag.toJSON().multihash.toString();
  }

  async canAppend(
    entry: Entry,
    // TODO: It's this issue that we need to solve: https://flow.org/try/#0PQKgBAAgZgNg9gdzCYAoVBLAdgFwKYBOUAhgMZ5gCSAQmAN6pgCQUccAFMQFxUCCAlDwDOOAtgDmAblQBfdNnxEyFSr3qomAagD6AIx41pc1KRjEhQsGowBbAA4w8NvLkur1TPT2pH0p85a0tg5OLjhutAwsbJw8AupgiUkEeDgArgRYYADkrHDZ0klgcnJAA
    // $FlowFixMe
    provider: PurserIdentityProvider,
  ): Promise<boolean> {
    const {
      identity: {
        id: walletAddress,
        publicKey: orbitPublicKey,
        signatures,
        type,
      },
    } = entry;

    if (walletAddress !== this._wallet.address) return false;
    if (type !== this._type) return false;

    const message = orbitPublicKey + signatures.id;
    const signature = signatures.publicKey;
    const isWalletSignatureValid =
      utils.verifyMessage(message, signature) === this._wallet.address;
    if (!isWalletSignatureValid) return false;

    return provider.verify(signatures.id, orbitPublicKey, walletAddress);
  }

  // eslint-disable-next-line class-methods-use-this
  async load() {
    console.log('Implement me');
  }
}

export default EthereumAccessController;
