/* eslint-env jest */
import * as ipfs from '../../src/data/ipfs'

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
  afterAll(async () => {
    await ipfs.clearNodes();
  });

  test('get peers exists and may return undefined', async () => {
    const node = ipfs.getIPFS(ipfs.makeOptions({ repo: 'test1' }));
    await node.ready();

    const peers = await ipfs.getPeers(node);
    expect(peers).toBeUndefined();
  })

  test('wait for peers exists and will return something after a while', async () => {
    const node = ipfs.getIPFS(ipfs.makeOptions({ repo: 'test2' }));
    await node.ready();

    const peers = await ipfs.waitForPeers(node);

    expect(peers).toBeTruthy();
    expect(peers.length).toBeGreaterThan(0);
  })
})