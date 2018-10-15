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

  constructor(){
    this._resolvers = new Map()
  }

  _createResolver(type: string): ENSResolverType {
    const ResolverClass = this._getResolverClass(type);
    if (!ResolverClass) return null;
    const resolver = new ResolverClass();
    this._cacheResolver(type, resolver);
    return resolver;
  }

  _getCachedResolver (type): ENSResolverType{
    return this._resolvers.has(type)
      ? this._resolvers.get(type)
      : null;
  }

  _getResolverClass(type: string) {
    return {
      user: UserResolver,
      colony: ColonyResolver
    }[type]
  }

  _cacheResolver(type: string, resolver: ENSResolverType) {
    this._resolvers.set(type, resolver);
  }

  getResolver(type): ENSResolverType {
    const cached = this._getCachedResolver(type);
    return cached ? cached : this._createResolver(type)
  }

  async lookupUsernameFromAddress (){
    const username = await ColonyNetworkClient.lookupRegisteredENSDomain()
    return username;
  }
  async getAddressForENSHash() {
    const address = await ColonyNetworkClient.getAddressForENSHash()
    return address
  }
}

class UserResolver extends ENSResolver{
  async resolve (identifier: string): OrbitDBAddress {
    const hashedIdentifier = namehash.hash(identifier);
    const dbAddress = await ColonyNetworkClient.getProfileDBAddress(hashedIdentifier)
    return dbAddress;
  }
}

class ColonyResolver extends ENSResolver{
  resolve(){
    throw new Error('cannot yet look up colony databases')
  }
}
