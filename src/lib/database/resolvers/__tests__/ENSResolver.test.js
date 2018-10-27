import ENSResolver from '../ENSResolver';
import ColonyResolver from '../ColonyResolver';

let resolver;
describe('ENSResolver', () => {
  test('Get a resolver', () => {
    resolver = new ENSResolver();
    expect(resolver).toBeTruthy();
    expect(typeof resolver.lookupDomainNameFromAddress).toBe('function');
  });
});
