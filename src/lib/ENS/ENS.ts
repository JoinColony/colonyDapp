/* eslint-disable no-underscore-dangle */

import namehash from 'eth-ens-namehash-ms';
import punycode from 'punycode';
import { AddressZero } from 'ethers/constants';

import { ColonyNetworkClient } from '@colony/colony-js';

import { Address, ENSName } from '~types/index';
import { createAddress, isAddress } from '~utils/web3';

const COLONY_NETWORK_ENS_NAME =
  process.env.COLONY_NETWORK_ENS_NAME || 'joincolony.eth';
const EXTERNAL_PREFIX = '$';

class ENS {
  public static getFullDomain = (scope: 'user' | 'colony', name: string) =>
    isAddress(name) ? name : `${name}.${scope}.${COLONY_NETWORK_ENS_NAME}`;

  public static stripDomainParts = (scope: 'user' | 'colony', domain: string) =>
    domain.split(`.${scope}.${COLONY_NETWORK_ENS_NAME}`)[0];

  public static normalize = namehash.normalize.bind(namehash);

  public static normalizeAsText = (domain?: string) => {
    if (!domain) return domain;
    try {
      return namehash.normalize(domain);
    } catch (e) {
      return null;
    }
  };

  _domainCache: Map<string, Address>;

  _addressCache: Map<Address, string>;

  constructor() {
    this._addressCache = new Map();
    this._domainCache = new Map();
  }

  async _getRawAddress(
    domain: string,
    networkClient: ColonyNetworkClient,
  ): Promise<Address | null> {
    let normalizedDomain;
    try {
      normalizedDomain = namehash.normalize(domain);
    } catch (e) {
      return null;
    }
    if (this._domainCache.has(normalizedDomain)) {
      // The default value is here to satisfy flow.
      return createAddress(this._domainCache.get(normalizedDomain) || '');
    }
    const ensAddress = await networkClient.addr(
      namehash.hash(normalizedDomain),
    );

    if (ensAddress !== AddressZero) {
      const address = createAddress(ensAddress);
      this._updateCaches(normalizedDomain, address);
      return address;
    }

    return null;
  }

  async _getRawDomain(
    address: Address,
    networkClient: ColonyNetworkClient,
  ): Promise<ENSName | null> {
    if (this._addressCache.has(address)) {
      // The default value is here to satisfy flow.
      return this._addressCache.get(address) || '';
    }

    // eslint-disable-next-line max-len
    const ensName = await networkClient.lookupRegisteredENSDomainWithNetworkPatches(
      address,
    );

    if (ensName) {
      this._updateCaches(ensName, address);
      return ensName;
    }

    return null;
  }

  async isENSNameAvailable(
    scope: 'user' | 'colony',
    ensName: ENSName,
    networkClient: ColonyNetworkClient,
  ): Promise<boolean> {
    const domain = ENS.getFullDomain(scope, ensName);

    const address = await this._getRawAddress(domain, networkClient);
    return !address;
  }

  /* Returns an Ethereum address, when given the human-readable name */
  async getAddress(
    domain: string,
    networkClient: ColonyNetworkClient,
  ): Promise<Address> {
    let normalizedDomain = domain;
    if (domain.startsWith(EXTERNAL_PREFIX)) {
      normalizedDomain = domain.substr(1);
    }

    const address = await this._getRawAddress(normalizedDomain, networkClient);

    if (!address) {
      throw new Error(`Address not found for "${normalizedDomain}"`);
    }

    return address;
  }

  async getDomain(
    address: Address,
    networkClient: ColonyNetworkClient,
  ): Promise<ENSName> {
    const rawDomain = await this._getRawDomain(address, networkClient);

    if (!rawDomain) {
      throw new Error(`ENS Name not found for address "${address}"`);
    }
    const domain = punycode.toASCII(rawDomain);
    return rawDomain === domain ? rawDomain : `${EXTERNAL_PREFIX}${rawDomain}`;
  }

  _updateCaches(domain: string, address: Address) {
    this._domainCache.set(domain, address);
    this._addressCache.set(address, domain);
  }
}

export default ENS;
