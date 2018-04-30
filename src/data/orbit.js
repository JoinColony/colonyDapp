/* @flow */
import OrbitDB from 'orbit-db';

const DEFAULT_DB_PATH = 'colonyOrbitdb';

export function makeOptions({ orbitRepo = undefined } = {}) {
  const dbPath = orbitRepo === undefined ? DEFAULT_DB_PATH : orbitRepo;
  return { path: dbPath, options: {} };
}

export async function getOrbitDB(ipfs, { path, options } = { path: DEFAULT_DB_PATH, options: {} }) {
  console.log('Get OrbitDB instance with path:', path);
  return new OrbitDB(ipfs, path, options);
}
