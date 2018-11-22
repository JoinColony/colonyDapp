/* @flow */

import ColonyNetworkClient from '@colony/colony-js-client';
import { isAddress } from 'web3-utils';

import { getHashedENSDomainString } from '~utils/ens';

import type { ColonyContext, ColonyIdentifier } from './types';

import { NETWORK_CONTEXT } from './constants';

export default class ColonyManager {
  static validateIdentifier(identifier?: any): ColonyIdentifier {
    if (
      !(
        identifier &&
        (isAddress(identifier.address) ||
          Number.isInteger(identifier.id) ||
          typeof identifier.ensName === 'string')
      )
    )
      throw new Error('Invalid colony identifier provided');
    return identifier;
  }

  clients: Map<ColonyIdentifier, ColonyNetworkClient.ColonyClient>;

  networkClient: ColonyNetworkClient;

  constructor(networkClient: ColonyNetworkClient) {
    this.clients = new Map();
    this.networkClient = networkClient;
  }

  _findColonyClient(identifier: ColonyIdentifier) {
    // eslint-disable-next-line no-unused-vars
    const [_, client] =
      [...this.clients.entries()].find(
        ([{ address, ensName, id }]) =>
          address === identifier.address ||
          id === identifier.id ||
          ensName === identifier.ensName,
      ) || [];
    return client;
  }

  async setColonyClient(identifier: ColonyIdentifier) {
    const { ensName, address, id } = identifier;
    const query = {};

    if (ensName) {
      const { ensAddress } = await this.networkClient.getAddressForENSHash.call(
        { nameHash: getHashedENSDomainString(ensName, 'user') },
      );
      query.address = ensAddress;
    } else if (address) {
      query.address = address;
    } else if (id) {
      query.id = id;
    }

    const client = await this.networkClient.getColony.call(query);

    this.clients.set(identifier, client);

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
