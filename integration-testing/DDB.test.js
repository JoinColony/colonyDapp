import test from 'ava';
import { create as createWallet } from '@colony/purser-software';
import OrbitDB from 'orbit-db';

import DDBTestFactory from './utils/DDBTestFactory';
import '../src/modules/validations';
import { DDB, SCHEMAS } from '../src/lib/database';
import { getAll } from '../src/lib/database/commands';
import PurserIdentity from '../src/lib/database/PurserIdentity';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';
import EthereumAccessController from '../src/lib/database/EthereumAccessController';

const factory = new DDBTestFactory('ddb.test');

test.before(async t => {
  DDB.registerSchema('userProfile', SCHEMAS.UserProfile);
  const ipfsNode = await factory.node('ddb1');
  const wallet = await createWallet();
  const identityProvider = new PurserIdentityProvider(wallet);
  const ddb = await DDB.createDatabase(ipfsNode, identityProvider);
  t.context = {
    ddb,
    ipfsNode,
    wallet,
  };
});

test.after.always(async t => {
  await t.context.ipfsNode.stop();
  await t.context.ddb.stop();
});

test('Using purser', t => {
  const { ddb } = t.context;
  t.truthy(ddb._orbitNode instanceof OrbitDB);
  t.truthy(ddb._orbitNode.identity instanceof PurserIdentity);
});

test('Can edit multiple attributes', async t => {
  const { ddb, wallet } = t.context;
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
  t.is(Object.keys(state).length, 3);
});
