/* eslint-env jest */
import ENSResolver from '../src/lib/database/ENSResolver';

let resolver;
let colonyResolver;
let userResolver;
describe('ENSResolver', () => {
  test('Get a resolver', () => {
    resolver = new ENSResolver();
    expect(resolver).toBeTruthy();
    expect(typeof resolver.lookupUsernameFromAddress).toBe('function');
  });
  test('User and colony resolvers inherit from ENSResolver', () => {
    userResolver = resolver.getResolver('user');
    colonyResolver = resolver.getResolver('colony');

    expect(userResolver instanceof ENSResolver).toBeTruthy();
    expect(colonyResolver instanceof ENSResolver).toBeTruthy();
  });
  test('User resolver contains a resolve method, colony resolver not implemented', async () => {
    expect(typeof userResolver.resolve).toBe('function');
    expect(colonyResolver.resolve).toThrow();
  });
});
