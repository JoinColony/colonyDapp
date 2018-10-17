/* @flow */

import namehash from 'eth-ens-namehash';
import ENSResolver from './ENSResolver';
import type { OrbitDBAddress } from '../types';

class UserResolver extends ENSResolver {
  async resolve(identifier: string): Promise<OrbitDBAddress> {
    const nameHash = namehash.hash(identifier);
    const {
      orbitDBAddress,
    } = await this._networkClient.getProfileDBAddress.call({
      nameHash,
    });

    return orbitDBAddress;
  }
}

export default UserResolver;
