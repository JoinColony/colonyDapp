/* @flow */

import ColonyNetworkClient from '@colony/colony-js-client';
import { isAddress } from 'web3-utils';

import { getHashedENSDomainString } from '~utils/web3/ens';

import type {
  Address,
  AddressOrENSName,
  ColonyContext,
  ENSName,
} from './types';

import { NETWORK_CONTEXT } from './constants';

export default class ColonyManager {
  clients: Map<Address, ColonyNetworkClient.ColonyClient>;

  _metaColonyClient: ColonyNetworkClient.ColonyClient;

  ensCache: Map<ENSName, Address>;

  networkClient: ColonyNetworkClient;

  constructor(networkClient: ColonyNetworkClient) {
    this.clients = new Map();
    this.ensCache = new Map();
    this.networkClient = networkClient;
  }

  async resolveColonyIdentifier(identifier: AddressOrENSName) {
    if (isAddress(identifier)) return identifier;

    // Get the address and update the ENS cache
    const { ensAddress } = await this.networkClient.getAddressForENSHash.call({
      nameHash: getHashedENSDomainString(identifier, 'colony'),
    });
    this.ensCache.set(identifier, ensAddress);
    return ensAddress;
  }

  async setColonyClient(address: Address) {
    const client = await this.networkClient.getColonyClientByAddress(address);
    this.clients.set(address, client);
    return client;
  }

  async getMetaColonyClient() {
    if (this._metaColonyClient) return this._metaColonyClient;
    this._metaColonyClient = await this.networkClient.getMetaColonyClient();
    return this._metaColonyClient;
  }

  async getColonyClient(identifier?: AddressOrENSName) {
    if (!(typeof identifier === 'string' && identifier.length))
      throw new Error('A colony address or ENS name must be provided');

    const address = await this.resolveColonyIdentifier(identifier);
    return this.clients.get(address) || this.setColonyClient(address);
  }

  getNetworkMethod(methodName: string) {
    return Reflect.get(this.networkClient, methodName);
  }

  async getColonyMethod(methodName: string, identifier?: AddressOrENSName) {
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
    identifier?: AddressOrENSName,
  ): Promise<M> {
    const method =
      context === NETWORK_CONTEXT
        ? this.getNetworkMethod(methodName)
        : this.getColonyMethod(methodName, identifier);
    if (!method) {
      throw new Error(`Method ${method} not found on ${context}`);
    }
    return method;
  }
}
