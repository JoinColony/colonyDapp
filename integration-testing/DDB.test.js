/* eslint-env jest */

import { create as createWallet } from '@colony/purser-software';
import OrbitDB from 'orbit-db';
import DDBTestFactory from './utils/DDBTestFactory';
import { DDB, SCHEMAS } from '../src/lib/database';
import { getAll } from '../src/lib/database/commands';
import PurserIdentity from '../src/lib/database/PurserIdentity';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';
import EthereumAccessController from '../src/lib/database/EthereumAccessController';

let wallet;
let identityProvider;
let ddb;
let ipfsNode;

const factory = new DDBTestFactory('ddb.test');

beforeAll(async () => {
  ipfsNode = await factory.node('ddb1');

  DDB.registerSchema('userProfile', SCHEMAS.UserProfile);

  wallet = await createWallet();

  identityProvider = new PurserIdentityProvider(wallet);

  ddb = await DDB.createDatabase(ipfsNode, identityProvider);
});

describe('Database setup', () => {
  test(
    'Using purser',
    async () => {
      /* eslint-disable no-underscore-dangle */
      expect(ddb._orbitNode).toBeInstanceOf(OrbitDB);
      expect(ddb._orbitNode.identity).toBeInstanceOf(PurserIdentity);
      /* eslint-enable no-underscore-dangle */
    },
    25000,
  );
  test(
    'Can edit multiple attributes',
    async () => {
      const accessController = new EthereumAccessController(wallet.address);
      const store = await ddb.createStore('keyvalue', 'userProfile', {
        accessController,
      });
      await store.set({
        username: 'hello',
        bio: 'born in Warsaw',
        walletAddress: wallet.address,
      });
      const state = getAll(store);
      expect(Object.keys(state).length).toBe(3);
    },
    25000,
  );
});
