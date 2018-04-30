/* eslint-env jest */
import Data from '../../src/data'

// https://stackoverflow.com/a/39914235
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Data component', () => {
  test('Create two Data components that can see each other.', async () => {
      const c1 = Data.fromDefaultConfig({ repo: 'data1' });

      // TODO: without this sleep, both repo contains the SAME private key. Something related to random & crypto in testing is broken.
      await sleep(500);

      const c2 = Data.fromDefaultConfig({ repo: 'data12' });

      await Promise.all([c1.ready(), c2.ready()]);

      await sleep(5000);

      console.log("I got peer1 with id:", await c1.peerId());
      console.log("I got peer2 with id:", await c2.peerId());

      const peers1 = await c1.listPeers();
      const peers2 = await c2.listPeers();

      console.log('They have:', peers1);
      console.log('They have:', peers2);

      expect(peers1.length).toBeGreaterThan(0);
      expect(peers2.length).toBeGreaterThan(0);

      expect(peers1).toContain(await c2.peerId());
      expect(peers2).toContain(await c1.peerId());
    },
    25000);
});
