/* @flow */

import { isAddress } from 'web3-utils';

import namehash from 'eth-ens-namehash-ms';

import type ColonyNetworkClient from '@colony/colony-js-client';

import ens from '../../../context/ensContext';

/* TODO: use `~utils/ens` as the import path when `ava` can resolve it */
import { getENSDomainString } from '../../../utils/web3/ens';

class ENSResolver {
  _networkClient: ColonyNetworkClient;

  static ensHash(name: string): string {
    return namehash.hash(name);
  }

  static suffix: string;

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
      : getENSDomainString(identifier, suffix);
  }

  /* Returns a human-readable colony or user name, when given an ensAddress / Ethereum address */
  // eslint-disable-next-line class-methods-use-this
  async lookupDomainNameFromAddress(ensAddress: string): Promise<any> {
    const domain = await ens.getDomain(ensAddress, this._networkClient);
    return domain;
  }

  /* Returns an Ethereum address, when given the human-readable name */
  async getENSAddressForENSName(name: string): Promise<any> {
    /* Get address from ENS cache */
    const ensAddress = await ens.getAddress(name, this._networkClient);
    return ensAddress;
  }
}

export default ENSResolver;
