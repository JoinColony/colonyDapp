/* @flow */

import ColonyNetworkClient from '@colony/colony-js-client';
import { isAddress } from 'web3-utils';

import type {
  ENSName,
  Address,
  AddressOrENSName,
  ColonyContext,
} from './types';

import { NETWORK_CONTEXT } from './constants';

import ens from '../../context/ensContext';

export default class ColonyManager {
  clients: Map<Address, ColonyNetworkClient.ColonyClient>;

  _metaColonyClient: ColonyNetworkClient.ColonyClient;

  networkClient: ColonyNetworkClient;

  constructor(networkClient: ColonyNetworkClient) {
    this.clients = new Map();
    this.networkClient = networkClient;
  }

  async resolveColonyIdentifier(identifier: AddressOrENSName): Promise<any> {
    if (isAddress(identifier)) return identifier;

    const ensAddress = await ens.getAddress(
      ens.constructor.getFullDomain('colony', identifier),
      this.networkClient,
    );
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
    // This typing isn't perfect; it would be better to use something like
    // $PropertyType<ColonyNetworkClient, methodName, but the key needs to
    // be a string literal.
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
