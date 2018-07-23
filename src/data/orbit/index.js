/* @flow */
import OrbitDB from 'orbit-db';
import type {
  ColonyIPFSNode,
  ColonyOrbitOptions,
  OrbitOptions,
} from '../types';

import UserProfile from './UserProfile';
import Kolonie from './Colony';

const DEFAULT_DB_PATH = 'colonyOrbitdb';

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

const orbitSetup = { getOrbitDB, makeOptions };

export { Kolonie, orbitSetup, UserProfile };
