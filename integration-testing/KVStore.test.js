import test from 'ava';
import * as yup from 'yup';
import { create as createWallet } from '@colony/purser-software';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';
import { KVStore } from '../src/lib/database/stores';
import DDBTestFactory from './utils/DDBTestFactory';
import '../src/modules/validations';
import { DDB } from '../src/lib/database';

import { getAll } from '../src/lib/database/commands';

const factory = new DDBTestFactory('kvstore.test');

const kvBlueprint = {
  getAccessController() {},
  name: 'user',
  schema: yup.object({
    username: yup.string().required(),
    bio: yup.string().required(),
  }),
  type: KVStore,
};

test.before(async t => {
  const wallet = await createWallet();

  const identityProvider = new PurserIdentityProvider(wallet);
  const ipfs = await factory.node('kvStore');
  const ddb = await DDB.createDatabase(ipfs, identityProvider);
  t.context = {
    ddb,
    ipfs,
    wallet,
  };
});

test.after.always(async t => {
  await t.context.ipfs.stop();
  await t.context.ddb.stop();
});

test('Can edit multiple attributes', async t => {
  const { ddb } = t.context;
  const store = await ddb.createStore(kvBlueprint);
  const profile = {
    username: 'hello',
    bio: 'born in Warsaw',
  };
  await store.set(profile);
  const state = getAll(store);
  t.deepEqual(state, profile);
});
