import test from 'ava';

import IPFSNode from '../src/lib/ipfs/IPFSNode';

import createIPFSNode from './utils/createIPFSNode';

test.before(async t => {
  const node1 = await createIPFSNode();
  t.context = {
    node1,
  };
});

test('Create an IPFS node', t => {
  t.truthy(t.context.node1 instanceof IPFSNode);
  t.truthy(t.context.node1._ipfs.pubsub);
  t.truthy(t.context.node1.pinner);
});
