/* eslint-env jest */
import Data from '../../src/data'

describe('Data component', () => {
  test('Create two Data components that can see each other.', async () => {
    const c1 = Data.fromDefaultConfig();
    const c2 = Data.fromDefaultConfig();

    const peers1 = await c1.listPeers();
    const peers2 = await c2.listPeers();

    expect(peers1.length).toBeGreaterThan(0);
    expect(peers2.length).toBeGreaterThan(0);

    expect(peers1).toContain(c2.peerId);
    expect(peers2).toContain(c1.peerId);
  });
});
