/* @flow */

import OrbitDB from 'orbit-db';
import Keystore from 'orbit-db-keystore';
import type { ColonyIPFSNode, ColonyOrbitOptions, OrbitOptions } from './types';

type WrappedOptions = { path: ?string, options: OrbitOptions };

const DEFAULT_DB_PATH = 'colonyOrbitdb';
const ETHEREUM_PROVIDER_TYPE = 'ETHEREUM_ACCOUNT';

const { IdentityProvider: OrbitDBIdentityProvider } = OrbitDB;
const orbitKeystore = Keystore.create();

export function makeOptions({ repo }: ColonyOrbitOptions = {}): WrappedOptions {
  const dbPath = repo === undefined ? DEFAULT_DB_PATH : repo;
  return { path: dbPath, options: {} };
}

export async function getOrbitDB(
  ipfs: ColonyIPFSNode,
  identity,
  options,
  // { path, options }: WrappedOptions = { path: DEFAULT_DB_PATH, options: {} },
) {
  return new OrbitDB(ipfs, identity, options);
}

// @TODO: apply flow

/**
 * Implements access control using an ethereum account previously linked to
 * an orbit key
 * @type {EthereumAccountAccessController}
 */
export class EthereumAccountAccessController {
  /**
   * Creates an EthereumAccountAccessController instance
   * @param {String}   [address]           Ethereum account address
   * @param {Function} [verifySignatureFn] Signature verification function
   */
  constructor(address, verifySignatureFn) {
    if (!address) throw new Error('An ethereum account address is required');
    if (!verifySignatureFn)
      throw new Error('A signature verification function is required');

    this._accountAddress = address;
    this._verifySignatureFn = verifySignatureFn;
  }

  async createManifest (ipfs, name, type) {
    const manifest = {
      name: name,
      type: type,
      account: `/ethereum/${this._accountAddress}`,
    };
    const dag = await ipfs.object.put(Buffer.from(JSON.stringify(manifest)));
    console.log('Manifest created', dag);
    return dag.toJSON().multihash.toString();
  }

  async canAppend(entry, provider) {
    const {
      identity: {
        id: walletAddress,
        publicKey: orbitPublicKey,
        signatures,
        type,
      },
    } = entry;

    if (walletAddress !== this._accountAddress) return false;
    if (type !== ETHEREUM_PROVIDER_TYPE) return false;

    // Current wallet is the only one that can write to this store so we use the current wallet to check the signature
    // const isWalletSignatureValid = await this._verifySignatureFn({
    //   message: orbitPublicKey + signatures.id,
    //   signature: signatures.publicKey,
    // });

    const data = orbitPublicKey + signatures.id;
    const signature = signatures.publicKey;
    const isWalletSignatureValid = await this._verifySignatureFn(
      walletAddress,
      data,
      signature,
    );
    if (!isWalletSignatureValid) return false;

    // const pubKey = await orbitKeystore.importPublicKey(orbitPublicKey);
    return provider.verify(signatures.id, orbitPublicKey, walletAddress);
  }

  async load() {}
}

/**
 * NOTE: We are enforcing the semantic here but orbit's default identity
 * provider will always check if a key exists using the id and create one if
 * it doesn't
 */
export async function createOrbitIdentity(wallet, address) {
  const key = await orbitKeystore.getKey(address);
  if (key) throw new Error(`A key for "${address}" already exists`);

  return OrbitDBIdentityProvider.createIdentity(orbitKeystore, address, {
    type: ETHEREUM_PROVIDER_TYPE,
    identitySignerFn: (_, data) => wallet.signMessage({ message: data }),
  });
}

export async function getOrbitIdentity(wallet, address) {
  const key = await orbitKeystore.getKey(address);
  if (!key) throw new Error(`A key for "${address}" was not found`);

  return OrbitDBIdentityProvider.createIdentity(orbitKeystore, address, {
    type: ETHEREUM_PROVIDER_TYPE,
    identitySignerFn: (_, data) => wallet.signMessage({ message: data }),
  });
}
