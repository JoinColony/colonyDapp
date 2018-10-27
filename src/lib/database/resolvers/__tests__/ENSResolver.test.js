import ENSResolver from '../ENSResolver';

let resolver;
describe('ENSResolver', () => {
  test('Get a resolver', () => {
    resolver = new ENSResolver();
    expect(resolver).toBeTruthy();
    expect(typeof resolver.lookupDomainNameFromAddress).toBe('function');
  });
});
