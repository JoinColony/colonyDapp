/* @flow */
import OrbitDB from 'orbit-db';

const DEFAULT_DB_PATH = 'colonyOrbitdb';

export function makeOptions({} = {}) {
  return [DEFAULT_DB_PATH, {}];
}

export async function getOrbitDB(ipfs) {
  // TODO: clean
  const [path, options] = makeOptions();
  console.log('Get OrbitDB instance with path:', path);
  return new OrbitDB(ipfs, path, options);
}
