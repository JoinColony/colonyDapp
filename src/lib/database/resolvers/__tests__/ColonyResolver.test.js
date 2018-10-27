import ENSResolver from '../ENSResolver';
import ColonyResolver from '../ColonyResolver';

let colonyResolver;

describe('Colony Resolver', () => {
  test('Colony resolver inherits from ENSResolver', () => {
    colonyResolver = new ColonyResolver({});

    expect(colonyResolver instanceof ENSResolver).toBeTruthy();
  });
  test('User resolver contains a resolve method, colony resolver not implemented', async () => {
    expect(colonyResolver.resolve).toThrow();
  });
});
