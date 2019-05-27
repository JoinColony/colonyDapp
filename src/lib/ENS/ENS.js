/* @flow */

import namehash from 'eth-ens-namehash-ms';
import { isAddress } from 'web3-utils';

import type ColonyNetworkClient from '@colony/colony-js-client';

import type { Address, ENSName } from './types';

const colonyNetworkENSName =
  process.env.COLONY_NETWORK_ENS_NAME || 'joincolony.eth';

class ENS {
  static getFullDomain = (scope: 'user' | 'colony', name: string) =>
    isAddress(name) ? name : `${name}.${scope}.${colonyNetworkENSName}`;

  _domainCache: Map<ENSName, Address>;

  _orbitAddressCache: Map<string, string>;

  constructor() {
    this._domainCache = new Map();
    this._orbitAddressCache = new Map();
  }

  /* Returns an Ethereum address, when given the human-readable name */
  async getAddress(ensDomain: string, networkClient: ColonyNetworkClient) {
    /* check if domain in store if so return otherwise get */
    if (!this._domainCache.has(ensDomain)) {
      const { ensAddress } = await networkClient.getAddressForENSHash.call({
        nameHash: namehash.hash(ensDomain),
      });

      if (ensAddress) {
        this._storeTwoWayCache(ensDomain, ensAddress);
      }

      return ensAddress;
    }

    return this._domainCache.get(ensDomain);
  }

  async getDomain(address: Address, networkClient: ColonyNetworkClient) {
    /* check if adress in store if so return otherwise get */
    if (!this._domainCache.has(address)) {
      const { domain } = await networkClient.lookupRegisteredENSDomain.call({
        ensAddress: address,
      });

      if (domain) {
        this._storeTwoWayCache(domain, address);
      }

      return domain;
    }

    /* get it from cache since it has be resolved before */
    return this._domainCache.get(address);
  }

  async getOrbitDBAddress(
    addressOrDomain: string,
    networkClient: ColonyNetworkClient,
  ) {
    let domain;
    if (isAddress(addressOrDomain)) {
      domain = await this.getDomain(addressOrDomain, networkClient);
    } else {
      domain = addressOrDomain;
    }
    if (!domain) return null;

    if (this._orbitAddressCache.has(domain)) {
      return this._orbitAddressCache.get(domain);
    }
    const { orbitDBAddress } = await networkClient.getProfileDBAddress.call({
      nameHash: namehash.hash(domain),
    });

    if (orbitDBAddress) {
      this._orbitAddressCache.set(domain, orbitDBAddress);
    }
    return orbitDBAddress;
  }

  _storeTwoWayCache(ensDomain: ENSName, address: string) {
    this._domainCache.set(ensDomain, address);
    this._domainCache.set(address, ensDomain);
  }
}

export default ENS;
