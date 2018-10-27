import createSandbox from 'jest-sandbox';
import ENSResolver from '../ENSResolver';
import UserResolver from '../UserResolver';

let userResolver;
const walletAddress = '0xAe8fE520435911cff55C9d1E3242221f34f7413a';
const sandbox = createSandbox();
const mockNetworkClient = {
  getProfileDBAddress: {
    call: sandbox.fn(() => ({
      orbitDBAddress: 'longOrbitDBAdress',
    })),
  },
};

beforeEach(() => {
  sandbox.clear();
});

describe('UserResolver', () => {
  test('User resolver inherits from ENSResolver', () => {
    userResolver = new UserResolver(mockNetworkClient);

    expect(userResolver instanceof ENSResolver).toBeTruthy();
  });

  test('User resolver has static suffix "user"', () => {
    expect(UserResolver.suffix).toBe('user');
  });

  test('getDomain expands short username with suffix', () => {
    expect(userResolver.getDomain('chris')).toBe('chris.user.joincolony.eth');
  });

  test('resolve handles wallet addresses and short usernames', async () => {
    const lookupDomainSpy = sandbox.spyOn(
      userResolver,
      'lookupDomainNameFromAddress',
    );

    const ensHashSpy = sandbox
      .spyOn(ENSResolver, 'ensHash')
      .mockImplementationOnce(name => `someHash-${name}`);

    const orbitAddress = await userResolver.resolve('chris');
    expect(lookupDomainSpy).not.toHaveBeenCalled();
    expect(ensHashSpy).toHaveBeenCalledWith('chris.user.joincolony.eth');
    expect(orbitAddress).toBe('longOrbitDBAdress');
  });

  test('looks up domain name when given wallet or Eth address', async () => {
    const lookupDomainSpy = sandbox
      .spyOn(userResolver, 'lookupDomainNameFromAddress')
      .mockImplementationOnce(async () => 'thiago.user.joincolony.eth');

    const ensHashSpy = sandbox
      .spyOn(ENSResolver, 'ensHash')
      .mockImplementationOnce(name => `someHash-${name}`);

    await userResolver.resolve(walletAddress);

    expect(lookupDomainSpy).toHaveBeenCalledWith(walletAddress);
    expect(ensHashSpy).toHaveBeenCalledWith('thiago.user.joincolony.eth');
  });
});
