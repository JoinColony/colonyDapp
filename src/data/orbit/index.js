/* @flow */
import OrbitDB from 'orbit-db';

import type {
  ColonyIPFSNode,
  ColonyOrbitOptions,
  OrbitOptions,
} from '../types';

import UserProfile from './UserProfile';

const DEFAULT_DB_PATH = 'colonyOrbitdb';

type WrappedOptions = { path: ?string, options: OrbitOptions };

export function makeOptions({ repo }: ColonyOrbitOptions = {}): WrappedOptions {
  const dbPath = repo === undefined ? DEFAULT_DB_PATH : repo;
  return { path: dbPath, options: {} };
}

const getOrbitDB = async (
  ipfs: ColonyIPFSNode,
  { path, options }: WrappedOptions = { path: DEFAULT_DB_PATH, options: {} },
) => new OrbitDB(ipfs, path, options);

const orbitSetup = { getOrbitDB, makeOptions };

export { orbitSetup, UserProfile };
