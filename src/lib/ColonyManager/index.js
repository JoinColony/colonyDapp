/* @flow */

import ColonyNetworkClient from '@colony/colony-js-client';
import { isAddress } from 'web3-utils';

import { getHashedENSDomainString } from '~utils/ens';

import type {
  Address,
  ColonyContext,
  ColonyIdentifier,
  ENSName,
} from './types';

import { NETWORK_CONTEXT } from './constants';

export default class ColonyManager {
  static validateIdentifier(identifier?: any): ColonyIdentifier {
    if (
      !(
        identifier &&
        (isAddress(identifier.address) ||
          typeof identifier.ensName === 'string')
      )
    )
      throw new Error('Invalid colony identifier provided');
    return identifier;
  }

  clients: Map<Address, ColonyNetworkClient.ColonyClient>;

  ensCache: Map<ENSName, Address>;

  networkClient: ColonyNetworkClient;

  constructor(networkClient: ColonyNetworkClient) {
    this.clients = new Map();
    this.networkClient = networkClient;
  }

  _findColonyClient(identifier: ColonyIdentifier) {
    const entry =
      [...this.clients.entries()].find(
        ([{ address, ensName, id }]) =>
          address === identifier.address ||
          id === identifier.id ||
          ensName === identifier.ensName,
      ) || [];
    return entry[1];
  }

  async resolveColonyIdentifier({
    ensName,
    address: givenAddress,
  }: ColonyIdentifier) {
    let address = givenAddress;

    if (ensName) {
      // Get the address and update the ENS cache
      ({
        ensAddress: address,
      } = await this.networkClient.getAddressForENSHash.call({
        nameHash: getHashedENSDomainString(ensName, 'user'),
      }));
      this.ensCache.set(ensName, address);
    }

    return address;
  }

  async setColonyClient(identifier: ColonyIdentifier) {
    const address = this.resolveColonyIdentifier(identifier);

    const client = await this.networkClient.getColony.call({ address });

    this.clients.set(address, client);

    return client;
  }

  async getColonyClient(identifier?: ColonyIdentifier) {
    const validatedId = this.constructor.validateIdentifier(identifier);

    return (
      this._findColonyClient(validatedId) || this.setColonyClient(validatedId)
    );
  }

  getNetworkMethod(methodName: string) {
    return Reflect.get(this.networkClient, methodName);
  }

  async getColonyMethod(methodName: string, identifier?: ColonyIdentifier) {
    const client = await this.getColonyClient(identifier);
    return Reflect.get(client, methodName);
  }

  async getMethod<
    // TODO this typing isn't perfect; it would be better to use something like
    // $PropertyType<ColonyNetworkClient, methodName>, but the key needs to be a
    // string literal.
    M:
      | ColonyNetworkClient.Caller<*, *, *>
      | ColonyNetworkClient.Sender<*, *, *>
      | ColonyNetworkClient.ColonyClient.Caller<*, *, *>
      | ColonyNetworkClient.ColonyClient.Sender<*, *, *>,
  >(
    context: ColonyContext,
    methodName: string,
    identifier?: ColonyIdentifier,
  ): Promise<M> {
    return context === NETWORK_CONTEXT
      ? this.getNetworkMethod(methodName)
      : this.getColonyMethod(methodName, identifier);
  }
}
