/* eslint-env jest */

import merge from 'deepmerge';

import IPFSNode from '../../src/lib/ipfsNode/IPFSNode';
import { sleep } from '../../src/utils/time';
import DDBTestFactory from '../utils/DDBTestFactory';

let pinner = null;
let node1 = null;
let node2 = null;

const factory = new DDBTestFactory('ipfs.test');

beforeAll(async () => {
  pinner = await factory.pinner();
  node1 = await factory.node('node1');
  await sleep(600); // prevent nodes with same keys
  node2 = await factory.node('node2');
  await factory.ready();
}, DDBTestFactory.TIMEOUT);

afterAll(async () => {
  await factory.clear();
}, DDBTestFactory.TIMEOUT);

describe('IPFS configuration', () => {
  test('Get default config', () => {
    const options = merge(IPFSNode.DEFAULT_OPTIONS, {
      ipfs: { repo: 'test1' },
    });

    expect(options.ipfs).toBeTruthy();
    expect(options.ipfs.config.Bootstrap).toBeTruthy();
    expect(options.ipfs.config.Addresses.Swarm).toBeTruthy();
    expect(options.ipfs.EXPERIMENTAL.pubsub).toBeTruthy();
  });
});

describe('IPFS peers management', () => {
  test(
    'wait for peers exists and will return something after a while',
    async () => {
      const peers = await node1.waitForSomePeers();

      expect(peers).toBeTruthy();
      expect(peers.length).toBeGreaterThan(0);
    },
    25000,
  );

  test(
    'two nodes will see each other data through the pinner',
    async () => {
      const block = Buffer.from('helloworld, I am a node from ipfs.test');

      const ipfs1 = node1.getIPFS();
      const ipfs2 = node2.getIPFS();
      const putResult = await ipfs1.block.put(block);
      const blockID = putResult.cid.toBaseEncodedString();

      await pinner.pinBlock(blockID);

      const retrieved = await ipfs2.block.get(blockID);

      expect(retrieved).toBeTruthy();
    },
    120000,
  );
});
