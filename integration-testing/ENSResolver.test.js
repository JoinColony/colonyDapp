/* eslint-env jest */
import { Resolvers } from '../src/lib/database';
import ENSResolver from '../src/lib/database/resolvers/ENSResolver';

let resolver;
let colonyResolver;
let userResolver;
describe('ENSResolver', () => {
  test('Get a resolver', () => {
    resolver = new ENSResolver();
    expect(resolver).toBeTruthy();
    expect(typeof resolver.lookupDomainNameFromAddress).toBe('function');
  });
  test('User and colony resolvers inherit from ENSResolver', () => {
    userResolver = new Resolvers.UserResolver('user');
    colonyResolver = new Resolvers.ColonyResolver('colony');

    expect(userResolver instanceof ENSResolver).toBeTruthy();
    expect(colonyResolver instanceof ENSResolver).toBeTruthy();
  });
  test('User resolver contains a resolve method, colony resolver not implemented', async () => {
    expect(typeof userResolver.resolve).toBe('function');
    expect(colonyResolver.resolve).toThrow();
  });
});
