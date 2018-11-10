/* @flow */

import namehash from 'eth-ens-namehash';
import { isAddress } from 'web3-utils';

import type ColonyNetworkClient from '@colony/colony-js-client';

class ENSResolver {
  _networkClient: ColonyNetworkClient;

  static suffix: string;

  static ensHash(name: string): string {
    return namehash.hash(name);
  }

  static isAddress(address: string): boolean {
    return isAddress(address);
  }

  constructor(networkClient: ColonyNetworkClient) {
    this._networkClient = networkClient;
  }

  getDomain(identifier: string): string {
    const { suffix } = this.constructor;
    return identifier.includes('.')
      ? identifier
      : `${identifier}.${suffix}.joincolony.eth`;
  }

  // Returns a human-readable colony or user name, when given an ensAddress / Ethereum address
  async lookupDomainNameFromAddress(ensAddress: string): Promise<string> {
    const { domain } = await this._networkClient.lookupRegisteredENSDomain.call(
      {
        ensAddress,
      },
    );
    return domain;
  }

  // Returns an Ethereum address, when given the human-readable name
  async getENSAddressForENSName(name: string): Promise<string> {
    const nameHash = namehash.hash(name);
    const { ensAddress } = await this._networkClient.getAddressForENSHash.call({
      nameHash,
    });
    return ensAddress;
  }
}

export default ENSResolver;
