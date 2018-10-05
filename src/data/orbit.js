/* @flow */
import OrbitDB from 'orbit-db';
import Keystore from 'orbit-db-keystore';
import type { ColonyIPFSNode, ColonyOrbitOptions, OrbitOptions } from './types';

const ETHEREUM_PROVIDER_TYPE = 'ETHEREUM_ACCOUNT';
const DEFAULT_DB_PATH = 'colonyOrbitdb';

type WrappedOptions = { path: ?string, options: OrbitOptions };

const { IdentityProvider: OrbitDBIdentityProvider } = OrbitDB;
const orbitKeystore = Keystore.create();

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
