import ENSResolver from '../ENSResolver';
import ColonyResolver from '../ColonyResolver';

describe('Colony Resolver', () => {
  test('Colony resolver inherits from ENSResolver', () => {
    const colonyResolver = new ColonyResolver({});

    expect(colonyResolver instanceof ENSResolver).toBeTruthy();
  });
  test('Colony resolver implemented', async () => {
    const colonyResolver = new ColonyResolver({
      getProfileDBAddress: {
        call: () =>
          Promise.resolve({ orbitDBAddress: '/orbitdb/someAddresss' }),
      },
    });
    const resolved = await colonyResolver.resolve('foo');
    expect(resolved).toBe('/orbitdb/someAddresss');
  });
});
