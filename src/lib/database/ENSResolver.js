/* @flow */

import ColonyNetworkClient from '@colony/colony-js-client';
import namehash from 'eth-ens-namehash';

interface ENSResolverType {
  type: string;
}

type OrbitDBAddress = {
  root: string,
  path: string,
};

export default class ENSResolver {
  _resolvers: Map<string, ENSResolverType>;

  constructor() {
    this._resolvers = new Map();
  }

  _createResolver(type: string): ENSResolverType {
    const ResolverClass = this._getResolverClass(type);
    if (!ResolverClass) return null;
    const resolver = new ResolverClass();
    this._cacheResolver(type, resolver);
    return resolver;
  }

  _getCachedResolver(type): ENSResolverType {
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

  getResolver(type): ENSResolverType {
    const cached = this._getCachedResolver(type);
    return cached || this._createResolver(type);
  }

  // eslint-disable-next-line class-methods-use-this
  async lookupUsernameFromAddress(ensAddress: string) {
    const username = await ColonyNetworkClient.lookupRegisteredENSDomain(
      ensAddress,
    );
    return username;
  }

  // eslint-disable-next-line class-methods-use-this
  async getENSAddressForENSName(name: string): string {
    const hashedIdentifier = namehash.hash(name);
    const address = await ColonyNetworkClient.getAddressForENSHash(
      hashedIdentifier,
    );
    return address;
  }
}

class UserResolver extends ENSResolver {
  // eslint-disable-next-line class-methods-use-this
  async resolve(identifier: string): OrbitDBAddress {
    const hashedIdentifier = namehash.hash(identifier);
    const dbAddress = await ColonyNetworkClient.getProfileDBAddress(
      hashedIdentifier,
    );
    return dbAddress;
  }
}

class ColonyResolver extends ENSResolver {
  // eslint-disable-next-line class-methods-use-this
  resolve() {
    throw new Error('cannot yet look up colony databases');
  }
}
