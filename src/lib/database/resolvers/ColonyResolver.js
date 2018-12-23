/* @flow */

import ENSResolver from './ENSResolver';

import type { ENSName } from '~types';

class ColonyResolver extends ENSResolver {
  static suffix = 'colony';

  async resolve(ensName: ENSName): Promise<string> {
    const domain = this.getDomain(ensName);
    const nameHash = this.constructor.ensHash(domain);

    const {
      orbitDBAddress,
    } = await this._networkClient.getProfileDBAddress.call({
      nameHash,
    });

    return orbitDBAddress;
  }
}

export default ColonyResolver;
