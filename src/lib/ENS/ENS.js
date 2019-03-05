/* @flow */

import namehash from 'eth-ens-namehash-ms';

import type ColonyNetworkClient from '@colony/colony-js-client';

import type { Address, ENSName } from './types';

class ENS {
  cacheMap: Map<ENSName, Address>;

  getDomain: Address => string;

  getAddress: (ENSName, ColonyNetworkClient) => Promise<string>;

  constructor() {
    this.cacheMap = new Map();
  }

  /* Returns an Ethereum address, when given the human-readable name */
  getAddress = async (
    ensDomain: string,
    networkClient: ColonyNetworkClient,
  ) => {
    /* check if domain in store if so return otherwise get */
    if (!this.cacheMap.has(ensDomain)) {
      const { ensAddress } = await networkClient.getAddressForENSHash.call({
        nameHash: namehash.hash(ensDomain),
      });

      this.storeTwoWayCache(ensDomain, ensAddress);

      return ensAddress;
    }

    return this.cacheMap.get(ensDomain);
  };

  getDomain = async (
    ensAddress: Address,
    networkClient: ColonyNetworkClient,
  ) => {
    /* check if adress in store if so return otherwise get */
    if (!this.cacheMap.has(ensAddress)) {
      const { ensDomain } = await networkClient.lookupRegisteredENSDomain.call({
        ensAddress,
      });

      this.storeTwoWayCache(ensDomain, ensAddress);

      return ensAddress;
    }

    /* get it from cache since it has be resolved before */
    return this.cacheMap.get(ensAddress);
  };

  storeTwoWayCache(ensDomain: ENSName, address: string) {
    this.cacheMap.set(ensDomain, address);

    this.cacheMap.set(address, ensDomain);
  }
}

export default ENS;
