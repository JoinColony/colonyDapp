/* @flow */

import OrbitDB from 'orbit-db';
import type { ColonyIPFSNode, ColonyOrbitOptions, OrbitOptions } from './types';

const DEFAULT_DB_PATH = 'colonyOrbitdb';
const ETHEREUM_PROVIDER_TYPE = 'ETHEREUM';

type WrappedOptions = { path: ?string, options: OrbitOptions };

export function makeOptions({ repo }: ColonyOrbitOptions = {}): WrappedOptions {
  const dbPath = repo === undefined ? DEFAULT_DB_PATH : repo;
  return { path: dbPath, options: {} };
}

export async function getOrbitDB(
  ipfs: ColonyIPFSNode,
  { path, options }: WrappedOptions = { path: DEFAULT_DB_PATH, options: {} },
) {
  return new OrbitDB(ipfs, path, options);
}

// @TODO: apply flow
export class EthereumWalletAccessController {
  constructor(wallet) {
    if (!wallet) throw new Error('Wallet is required');
    this._wallet = wallet;
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

    if (type !== ETHEREUM_PROVIDER_TYPE) return false;

    // Current wallet is the only one that can write to this store so we use the current wallet to check the signature
    const isWalletSignatureValid = await this._wallet.verifyMessage({
      message: orbitPublicKey + signatures.id,
      signature: signatures.publicKey,
    });
    if (!isWalletSignatureValid) return false;

    return provider.verify(signatures.id, orbitPublicKey, walletAddress);
  }
}
