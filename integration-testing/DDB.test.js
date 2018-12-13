import test from 'ava';
import { create as createWallet } from '@colony/purser-software';
import OrbitDB from 'orbit-db';

import DDBTestFactory from './utils/DDBTestFactory';
import '../src/modules/validations';
import { DDB } from '../src/lib/database';
import PurserIdentity from '../src/lib/database/PurserIdentity';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';

const factory = new DDBTestFactory('ddb.test');

test.before(async t => {
  const ipfsNode = await factory.node('ddb1');
  const wallet = await createWallet();
  const identityProvider = new PurserIdentityProvider(wallet);
  const ddb = new DDB(ipfsNode, identityProvider);
  await ddb.init();
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
