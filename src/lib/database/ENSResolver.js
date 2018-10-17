/* @flow */

import namehash from 'eth-ens-namehash';

import type ColonyNetworkClient from '@colony/colony-js-client';

class ENSResolver {
  _resolvers: Map<string, ENSResolverType>;

  _networkClient: ColonyNetworkClient;

  constructor(networkClient: ColonyNetworkClient) {
    this._resolvers = new Map();
    this._networkClient = networkClient;
  }

  _createResolver(type: string): ENSResolverType | null {
    const ResolverClass = this._getResolverClass(type);
    if (!ResolverClass) return null;
    const resolver = new ResolverClass();
    this._cacheResolver(type, resolver);
    return resolver;
  }

  _getCachedResolver(type: string): ENSResolverType | null {
    return this._resolvers.has(type) ? this._resolvers.get(type) : null;
  }

  // eslint-disable-next-line class-methods-use-this
  _getResolverClass(type: string) {
    return {
      user: UserResolver, // eslint-disable-line no-use-before-define
      colony: ColonyResolver, // eslint-disable-line no-use-before-define
    }[type];
  }

  _cacheResolver(type: string, resolver: ENSResolverType) {
    this._resolvers.set(type, resolver);
  }

  getResolver(type: string): ENSResolverType | null {
    const cached = this._getCachedResolver(type);
    return cached || this._createResolver(type);
  }

  async lookupUsernameFromAddress(ensAddress: string): Promise<string> {
    const { domain } = await this._networkClient.lookupRegisteredENSDomain.call(
      {
        ensAddress,
      },
    );
    return domain;
  }

  async getENSAddressForENSName(name: string): Promise<string> {
    const nameHash = namehash.hash(name);
    const { ensAddress } = await this._networkClient.getAddressForENSHash.call({
      nameHash,
    });
    return ensAddress;
  }
}

export default ENSResolver;
