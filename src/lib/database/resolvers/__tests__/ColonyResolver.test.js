import ENSResolver from '../ENSResolver';
import ColonyResolver from '../ColonyResolver';

let colonyResolver;

describe('Colony Resolver', () => {
  test('Colony resolver inherits from ENSResolver', () => {
    colonyResolver = new ColonyResolver({});

    expect(colonyResolver instanceof ENSResolver).toBeTruthy();
  });
  test('Colony resolver implemented', async () => {
    // TODO this test could be better 🙃
    expect(colonyResolver.resolve).not.toThrow();
  });
});
