/* eslint-disable dot-notation */

import anyTest, { TestInterface } from 'ava';

import { create as createWallet } from '@colony/purser-software';
import OrbitDB from 'orbit-db';

import '../src/modules/validations';
import IPFSNode from '../src/lib/ipfs/IPFSNode';
import { DDB } from '../src/lib/database';
import PurserIdentity from '../src/data/PurserIdentity';
import PurserIdentityProvider from '../src/data/PurserIdentityProvider';

import createIPFSNode from './utils/createIPFSNode';

const test = anyTest as TestInterface<{
  ipfsNode: IPFSNode;
  ddb: DDB;
  wallet: any;
}>;

test.before(async t => {
  const ipfsNode = await createIPFSNode({});
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
  t.truthy(ddb['orbitNode'] instanceof OrbitDB);
  t.truthy(ddb['orbitNode'].identity instanceof PurserIdentity);
});
