/* @flow */

import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';
import { utils } from 'ethers';

import type { AccessController, Entry } from './AccessController';

import PurserIdentityProvider from './PurserIdentityProvider';

// TODO: Use actual type for common wallet interface
type PurserWallet = WalletObjectType;
type ProviderType = 'ORBITDB';

const PROVIDER_TYPE = 'ORBITDB';

/**
 * Access controller for Purser based Ethereum wallets
 */
class OrbitAccessController implements AccessController {
  _purserWallet: PurserWallet;

  _type: ProviderType;

  _manifest: Object;

  constructor(aclStore, purserWallet: PurserWallet) {
    this._type = PROVIDER_TYPE;
    this._aclStore = aclStore;
    // NOTE: only used before modifying the whitelist
    this._purserWallet = purserWallet;
  }

  async _canModifyWhitelist(accountAddress) {
    const isOwner =
      this._purserWallet.address === accountAddress &&
      accountAddress === this._owner;

    if (!isOwner) return false;

    // @TODO This should use the current wallet
    return this._purserWallet.verifyMessage({
      message: accountAddress,
      signature: this._manifestSignature,
    });
  }

  async _isAllowedToWrite(accountAddress) {
    const authorization = this._whitelist && this._whitelist[accountAddress];
    return (
      authorization &&
      utils.verifyMessage(accountAddress, authorization) === this._owner
    );
  }

  async loadMetadata(manifest: Object) {
    const { owner, signature } = manifest;
    const isManifestValid = utils.verifyMessage(owner, signature) === owner;
    if (!isManifestValid) {
      throw new Error('Invalid manifest, signature doesnt match');
    }

    this._owner = owner;
    this._manifestSignature = signature;
    // @TODO load and validate lists using custom store
    this._whitelist = [];
  }

  async createManifest(
    ipfs: IPFS,
    name: string,
    storeType: string,
  ): Promise<string> {
    if (!this._purserWallet.address) {
      throw new Error('Could not get wallet address. Is it unlocked?');
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

  async load(ipfs: IPFS, address: string) {
    const dbAddress = OrbitDB.parseAddress(address);
    const dag = await ipfs.object.get(dbAddress.root);
    const manifest = JSON.parse(dag.toJSON().data);
    await this.loadMetadata(manifest);
  }

  async addToWhitelist(store, address) {
    // @TODO This should use the current wallet
    const isOwner = await this._purserWallet.verifyMessage({
      message: this._purserWallet.address,
      signature: this._manifestSignature,
    });
    if (!isOwner) throw new Error('Only the owner can modify the whitelist');

    const whitelist = await store.get(WHITELIST);
    const signature = await this._purserWallet.signMessage({
      message: address,
    });

    whitelist[address] = signature;
    return store.put(WHITELIST, whitelist);
  }

  async removeFromWhitelist(store, address) {
    // @TODO This should use the current wallet
    const isOwner = await this._purserWallet.verifyMessage({
      message: this._purserWallet.address,
      signature: this._manifestSignature,
    });
    if (!isOwner) throw new Error('Only the owner can modify the whitelist');

    const whitelist = await store.get(WHITELIST);
    delete whitelist[address];
    return store.put(WHITELIST, whitelist);
  }

  async canAppend(
    entry: Entry,
    // TODO: It's this issue that we need to solve: https://flow.org/try/#0PQKgBAAgZgNg9gdzCYAoVBLAdgFwKYBOUAhgMZ5gCSAQmAN6pgCQUccAFMQFxUCCAlDwDOOAtgDmAblQBfdNnxEyFSr3qomAagD6AIx41pc1KRjEhQsGowBbAA4w8NvLkur1TPT2pH0p85a0tg5OLjhutAwsbJw8AupgiUkEeDgArgRYYADkrHDZ0klgcnJAA
    // $FlowFixMe
    provider: PurserIdentityProvider,
  ): Promise<boolean> {
    if (!(this._whitelist && this._whitelist.length))
      throw new Error('Could not load whitelisted addresses');

    const {
      payload: { key },
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

    if (key === WHITELIST) return this._canModifyWhitelist(accountAddress);
    if (key === DATA) return this._isAllowedToWrite(accountAddress);
    return false;
  }
}

export default OrbitAccessController;
