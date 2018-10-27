/* @flow */

import ENSResolver from './ENSResolver';
import type { OrbitDBAddress } from '../types';

class UserResolver extends ENSResolver {
  static suffix = 'user';

  async resolve(identifier: string): Promise<OrbitDBAddress> {
    let domain;
    if (ENSResolver.isAddress(identifier)) {
      domain = await this.lookupDomainNameFromAddress(identifier);
    } else {
      domain = this.getDomain(identifier);
    }
    const nameHash = ENSResolver.ensHash(domain);
    const {
      orbitDBAddress,
    } = await this._networkClient.getProfileDBAddress.call({
      nameHash,
    });

    return orbitDBAddress;
  }
}

export default UserResolver;
