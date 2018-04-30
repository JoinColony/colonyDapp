/* eslint-env jest */
import * as ipfs from '../../src/data/ipfs'
import { Pinner } from './pinner.mock'

// https://stackoverflow.com/a/39914235
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let pinner = null;
let node = null;

beforeAll(async () => {
  pinner = await Pinner();

  node = ipfs.getIPFS(ipfs.makeOptions({
    repo: '/tmp/tests/node1',
    bootstrap: [
      ...pinner.bootstrap()
    ]
  }));
  await node.ready();
})

afterAll(async () => {
  await pinner.stop();
  await ipfs.clearNodes();
});

describe('IPFS configuration', () => {
  test('Get default config', () => {
    const options = ipfs.makeOptions({ repo: 'test1' });

    expect(options).toBeTruthy();
    expect(options.config.Bootstrap).toBeTruthy();
    expect(options.config.Addresses.Swarm).toBeTruthy();
    expect(options.EXPERIMENTAL.pubsub).toBeTruthy();
  });
});

describe('IPFS peers management', () => {

  test('wait for peers exists and will return something after a while', async () => {
    const peers = await ipfs.waitForSomePeers(node);

    expect(peers).toBeTruthy();
    expect(peers.length).toBeGreaterThan(0);
  }, 25000);

  test('two nodes will see each other data', async () => {
    const node1 = ipfs.getIPFS(ipfs.makeOptions({
      repo: '/tmp/tests/node2',
      bootstrap: [...pinner.bootstrap()]
    }));

    await sleep(600); // prevent nodes with same keys

    const node2 = ipfs.getIPFS(ipfs.makeOptions({
      repo: '/tmp/tests/node3',
      bootstrap: [...pinner.bootstrap()]
    }));

    await Promise.all([node1.ready(), node2.ready()]);
    await Promise.all([pinner.waitForMe(node1), pinner.waitForMe(node2)]);

    const block = Buffer.from('helloworld, I am a node from ipfs.test');

    const putResult = await node1.block.put(block)
    const blockID = putResult.cid.toBaseEncodedString();

    await pinner.pinBlock(blockID)

    const retrieved = await node2.block.get(blockID);

    expect(retrieved).toBeTruthy();
  }, 120000);
})