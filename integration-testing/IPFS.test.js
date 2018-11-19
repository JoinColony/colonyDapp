import test from 'ava';
import merge from 'deepmerge';

import IPFSNode from '../src/lib/ipfs';
import { sleep } from '../src/utils/time';
import DDBTestFactory from './utils/DDBTestFactory';

const factory = new DDBTestFactory('ipfs.test');

test.before(async t => {
  const pinner = await factory.pinner();
  const node1 = await factory.node('node1');
  await sleep(600); // prevent nodes with same keys
  const node2 = await factory.node('node2');
  await factory.ready();
  t.context = {
    pinner,
    node1,
    node2,
  };
});

test.after.always(async () => {
  await factory.clear();
});

test('Get default IPFS config', t => {
  const options = merge(IPFSNode.DEFAULT_OPTIONS, {
    ipfs: { repo: 'test1' },
  });

  t.truthy(options.ipfs);
  t.truthy(options.ipfs.config.Bootstrap);
  t.truthy(options.ipfs.config.Addresses.Swarm);
  t.truthy(options.ipfs.EXPERIMENTAL.pubsub);
});

test('wait for peers exists and will return something after a while', async t => {
  const { node1 } = t.context;
  const peers = await node1.waitForSomePeers();

  t.truthy(peers);
  t.truthy(peers.length > 0);
});

test('two nodes will see each other data through the pinner', async t => {
  const { node1, node2, pinner } = t.context;
  const block = Buffer.from('helloworld, I am a node from ipfs.test');

  const ipfs1 = node1.getIPFS();
  const ipfs2 = node2.getIPFS();
  const putResult = await ipfs1.block.put(block);
  const blockID = putResult.cid.toBaseEncodedString();

  await pinner.pinBlock(blockID);

  const retrieved = await ipfs2.block.get(blockID);

  t.truthy(retrieved);
});
