/* eslint-env jest */
import Data from '../../src/data'

// https://stackoverflow.com/a/39914235
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Data component', () => {
  test('Create two Data components that can see each other.', async () => {
      const c1 = Data.fromDefaultConfig({ repo: 'data1' });
      const c2 = Data.fromDefaultConfig({ repo: 'data12' });

      await Promise.all([c1.ready(), c2.ready()]);

      await sleep(15000);

      const peers1 = await c1.listPeers();
      const peers2 = await c2.listPeers();

      expect(peers1.length).toBeGreaterThan(0);
      expect(peers2.length).toBeGreaterThan(0);

      expect(peers1).toContain(await c2.peerId());
      expect(peers2).toContain(await c1.peerId());
    },
    25000);
});
