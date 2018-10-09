/* @flow */

import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import IPFS from 'ipfs';
import { utils } from 'ethers';

import type { AccessController, Entry } from './AccessController';

import PurserIdentityProvider from './PurserIdentityProvider';

// TODO: Use actual type for common wallet interface
type PurserWallet = WalletObjectType;
type ProviderType = 'WHITELIST';

const PROVIDER_TYPE = 'WHITELIST';

/**
 * Access controller for Purser based Ethereum wallets
 */
class ColonyAccessController implements AccessController {
  _purserWallet: PurserWallet;

  _type: ProviderType;

  _manifest: Object;

  constructor(
    attributesBasedAccessController: Object,
    purserWallet: PurserWallet,
  ) {
    this._purserWallet = purserWallet;
    this._type = PROVIDER_TYPE;
    this._attributesBasedAccessController = attributesBasedAccessController;

    if (!this._purserWallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }
  }

  // @TODO: should we add the colony address in the context object?
  async can(action, context = {}) {
    return this._attributesBasedAccessController.can(
      action,
      this._purserWallet,
      context,
    );
  }

  async createManifest(
    ipfs: IPFS,
    name: string,
    storeType: string,
  ): Promise<string> {
    if (!this._purserWallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
    }

    const isAllowed = await this.can('create-colony-database');
    if (!isAllowed) {
      throw new Error('Cannot create colony database, user not allowed');
    }

    const signature = await this._purserWallet.signMessage({
      message: this._purserWallet.address,
    });

    const manifest = {
      name,
      type: storeType,
      signature,
      owner: this._purserWallet.address,
    };

    const dag = await ipfs.object.put(Buffer.from(JSON.stringify(manifest)));
    return dag.toJSON().multihash.toString();
  }

  // eslint-disable-next-line class-methods-use-this
  async load() {
    // eslint-lint-disable-next-line no-console
    console.log('Implement me!');
  }

  async canAppend(
    entry: Entry,
    // TODO: It's this issue that we need to solve: https://flow.org/try/#0PQKgBAAgZgNg9gdzCYAoVBLAdgFwKYBOUAhgMZ5gCSAQmAN6pgCQUccAFMQFxUCCAlDwDOOAtgDmAblQBfdNnxEyFSr3qomAagD6AIx41pc1KRjEhQsGowBbAA4w8NvLkur1TPT2pH0p85a0tg5OLjhutAwsbJw8AupgiUkEeDgArgRYYADkrHDZ0klgcnJAA
    // $FlowFixMe
    provider: PurserIdentityProvider,
  ): Promise<boolean> {
    if (!(this._actions && this._actions.length))
      throw new Error('Could not load whitelisted addresses');

    const {
      payload,
      identity: {
        id: accountAddress,
        publicKey: orbitPublicKey,
        signatures,
        type,
      },
    } = entry;

    if (type !== PROVIDER_TYPE) return false;

    const data = orbitPublicKey + signatures.id;
    const signature = signatures.publicKey;
    const isWalletSignatureValid = await utils.verifyMessage(data, signature);
    if (!isWalletSignatureValid) return false;

    const isOrbitSignatureValid = await provider.verify(
      signatures.id,
      orbitPublicKey,
      accountAddress,
    );
    if (!isOrbitSignatureValid) return false;

    const { value } = payload;
    const { __eventType } = value;
    return this.can(__eventType, value);
  }
}

export default ColonyAccessController;
