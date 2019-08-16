import test from 'ava';
import { create as createWallet } from '@colony/purser-software';
import OrbitDB from 'orbit-db';

import '../src/modules/validations';
import { DDB } from '../src/lib/database';
import PurserIdentity from '../src/data/PurserIdentity';
import PurserIdentityProvider from '../src/data/PurserIdentityProvider';

import createIPFSNode from './utils/createIPFSNode';

test.before(async t => {
  // @ts-ignore
  const ipfsNode = await createIPFSNode();
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
  await (t.context as any).ipfsNode.stop();
  await (t.context as any).ddb.stop();
});

test('Using purser', t => {
  const { ddb } = t.context as any;
  t.truthy(ddb._orbitNode instanceof OrbitDB);
  t.truthy(ddb._orbitNode.identity instanceof PurserIdentity);
});
