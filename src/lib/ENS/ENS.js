/* @flow */

import namehash from 'eth-ens-namehash-ms';
import { isAddress } from 'web3-utils';

import type ColonyNetworkClient from '@colony/colony-js-client';

import type { Address, ENSName } from '~types';

import { createAddress } from '~types';

class ENS {
  static getFullDomain = (scope: 'user' | 'colony', name: string) =>
    isAddress(name) ? name : `${name}.${scope}.joincolony.eth`;

  _domainCache: Map<string, Address>;

  _addressCache: Map<Address, string>;

  _orbitAddressCache: Map<string, string>;

  constructor() {
    this._addressCache = new Map();
    this._domainCache = new Map();
    this._orbitAddressCache = new Map();
  }

  async getAddressForDomain(
    domain: string,
    networkClient: ColonyNetworkClient,
  ): Promise<?Address> {
    const { ensAddress } = await networkClient.getAddressForENSHash.call({
      nameHash: namehash.hash(domain),
    });

    if (ensAddress) {
      const address = createAddress(ensAddress);
      this._updateCaches(domain, address);
      return address;
    }

    return null;
  }

  async isENSNameAvailable(
    scope: 'user' | 'colony',
    ensName: ENSName,
    networkClient: ColonyNetworkClient,
  ): Promise<boolean> {
    const domain = this.constructor.getFullDomain(scope, ensName);

    if (this._domainCache.has(domain)) {
      return false;
    }

    const address = await this.getAddressForDomain(domain, networkClient);

    return !address;
  }

  /* Returns an Ethereum address, when given the human-readable name */
  async getAddress(
    domain: string,
    networkClient: ColonyNetworkClient,
  ): Promise<Address> {
    if (this._domainCache.has(domain)) {
      // The default value is here to satisfy flow.
      return createAddress(this._domainCache.get(domain) || '');
    }

    const address = await this.getAddressForDomain(domain, networkClient);

    if (!address) {
      throw new Error(`Address not found for "${domain}"`);
    }

    return address;
  }

  async getDomain(
    address: Address,
    networkClient: ColonyNetworkClient,
  ): Promise<ENSName> {
    if (this._addressCache.has(address)) {
      // The default value is here to satisfy flow.
      return this._addressCache.get(address) || '';
    }

    const {
      domain: ensName,
    } = await networkClient.lookupRegisteredENSDomain.call({
      ensAddress: address,
    });

    if (!ensName) {
      throw new Error(`ENS Name not found for address "${address}"`);
    }

    this._updateCaches(ensName, address);

    return ensName;
  }

  async getOrbitDBAddress(
    addressOrDomain: string,
    networkClient: ColonyNetworkClient,
  ): Promise<?string> {
    const domain = isAddress(addressOrDomain)
      ? await this.getDomain(createAddress(addressOrDomain), networkClient)
      : addressOrDomain;

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

  _updateCaches(domain: string, address: Address) {
    this._domainCache.set(domain, address);
    this._addressCache.set(address, domain);
  }
}

export default ENS;
