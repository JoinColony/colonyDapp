/* @flow */

import ENSResolver from './ENSResolver';
import type { OrbitDBAddress } from '../types';

class UserResolver extends ENSResolver {
  async resolve(identifier: string): Promise<OrbitDBAddress> {
    const nameHash = ENSResolver.ensHash(identifier);
    const {
      orbitDBAddress,
    } = await this._networkClient.getProfileDBAddress.call({
      nameHash,
    });

    return orbitDBAddress;
  }
}

export default UserResolver;
