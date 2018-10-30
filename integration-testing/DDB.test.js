/* eslint-env jest */

import { create as createWallet } from '@colony/purser-software';
import OrbitDB from 'orbit-db';
import ipfsNode from '../src/lib/ipfs';
import { DDB, SCHEMAS } from '../src/lib/database';
import { getAll } from '../src/lib/database/commands';
import PurserIdentity from '../src/lib/database/PurserIdentity';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';

let wallet;
let identityProvider;
let ddb;

beforeAll(async () => {
  DDB.registerSchema('userProfile', SCHEMAS.UserProfile);

  wallet = await createWallet();

  identityProvider = new PurserIdentityProvider(wallet);

  ddb = await DDB.createDatabase(ipfsNode, identityProvider);
});

describe('Database setup', () => {
  test('Using purser', async () => {
    /* eslint-disable no-underscore-dangle */
    expect(ddb._orbitNode).toBeInstanceOf(OrbitDB);
    expect(ddb._orbitNode.identity).toBeInstanceOf(PurserIdentity);
    /* eslint-enable no-underscore-dangle */
  });
  test('Can edit multiple attributes', async () => {
    const store = await ddb.createStore('keyvalue', 'userProfile');
    await store.set({ username: 'hello', bio: 'born in Warsaw' });
    const state = getAll(store);
    expect(Object.keys(state).length).toBe(2);
  });
});
