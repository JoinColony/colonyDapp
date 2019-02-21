/* @flow */

import namehash from 'eth-ens-namehash-ms';

import type ColonyNetworkClient from '@colony/colony-js-client';

import type { Address, ENSName } from './types';

class ENS {
  cacheMap: Map<ENSName, Address>;

  constructor() {
    this.cacheMap = new Map();
  }

  static ensHash(name: string): string {
    return namehash.hash(name);
  }

  // Returns an Ethereum address, when given the human-readable name
  async getENSAddressForENSName(
    name: string,
    networkClient: ColonyNetworkClient,
  ): Promise<string> {
    const nameHash = this.constructor.ensHash(name);
    const { ensAddress } = await networkClient.getAddressForENSHash.call({
      nameHash,
    });
    return ensAddress;
  }

  async getAddress(ensDomain: string, networkClient: ColonyNetworkClient) {
    // check if adress in store if so return otherwise get

    if (!this.cacheMap.has(ensDomain)) {
      const address = await this.getENSAddressForENSName(
        ensDomain,
        networkClient,
      );

      this.storeTwoWayCache(ensDomain, address);

      return address;
    }

    return this.cacheMap.get(ensDomain);
  }

  getDomain(ensAddress: string) {
    // get it from cache since it has be resolved before
    return this.cacheMap.get(ensAddress);
  }

  storeTwoWayCache(ensDomain: string, address: string) {
    this.cacheMap.set(ensDomain, address);

    this.cacheMap.set(address, ensDomain);
  }
}

export default ENS;
