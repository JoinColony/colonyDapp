import ENSResolver from '../ENSResolver';
import ColonyResolver from '../ColonyResolver';

let colonyResolver;

describe('ENSResolver', () => {
  test('Colony resolver inherits from ENSResolver', () => {
    colonyResolver = new ColonyResolver('user');

    expect(colonyResolver instanceof ENSResolver).toBeTruthy();
  });
  test('User resolver contains a resolve method, colony resolver not implemented', async () => {
    expect(colonyResolver.resolve).toThrow();
  });
});
