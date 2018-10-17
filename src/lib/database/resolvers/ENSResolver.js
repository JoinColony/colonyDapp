/* @flow */

import namehash from 'eth-ens-namehash';

import type ColonyNetworkClient from '@colony/colony-js-client';

class ENSResolver {
  _networkClient: ColonyNetworkClient;

  constructor(networkClient: ColonyNetworkClient) {
    this._networkClient = networkClient;
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
