import { Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import {
  getTokenClient,
  ClientType,
  ColonyNetworkClient,
  ColonyClient,
  TokenClient,
} from '@colony/colony-js';
import { isAddress } from 'web3-utils';

import ENS from '~lib/ENS';
import { Address, AddressOrENSName } from '~types/index';

import ens from '../../context/ensContext';

type ContractClient = ColonyClient | ColonyNetworkClient | TokenClient;

export default class ColonyManager {
  private metaColonyClient?: ColonyClient;

  clients: Map<Address, Promise<ColonyClient>>;

  networkClient: ColonyNetworkClient;

  provider: Provider;

  signer: Signer;

  constructor(networkClient: ColonyNetworkClient) {
    this.clients = new Map();
    this.networkClient = networkClient;
    this.provider = networkClient.provider;
    this.signer = networkClient.signer;
  }

  private async getColonyPromise(address: Address) {
    const client = await this.networkClient.getColonyClient(address);

    // Check if the colony exists by calling `getVersion` (in lieu of an
    // explicit means of checking whether a colony exists at an address).
    try {
      await client.version();
    } catch (caughtError) {
      throw new Error(`Colony with address ${address} not found`);
    }
    return client;
  }

  async resolveColonyIdentifier(identifier: AddressOrENSName): Promise<any> {
    return isAddress(identifier)
      ? identifier
      : ens.getAddress(
          ENS.getFullDomain('colony', identifier),
          this.networkClient,
        );
  }

  async setColonyClient(address: Address): Promise<ColonyClient> {
    const clientPromise = this.getColonyPromise(address);
    this.clients.set(address, clientPromise);
    clientPromise.catch(() => this.clients.delete(address));
    return clientPromise;
  }

  async getMetaColonyClient(): Promise<ColonyClient> {
    if (this.metaColonyClient) return this.metaColonyClient;
    this.metaColonyClient = await this.networkClient.getMetaColonyClient();
    return this.metaColonyClient;
  }

  async getColonyClient(identifier: AddressOrENSName): Promise<ColonyClient> {
    if (!(typeof identifier === 'string' && identifier.length)) {
      throw new Error('A colony address or ENS name must be provided');
    }

    const address = await this.resolveColonyIdentifier(identifier);
    return this.clients.get(address) || this.setColonyClient(address);
  }

  /**
   * Given a token contract address, create a `TokenClient` with the minimal
   * token ABI loader and return it. The promise will be rejected if
   * the functions do not exist on the contract.
   */
  async getTokenClient(contractAddress: string) {
    return getTokenClient(contractAddress, this.signer);
  }

  async getNetworkMethod<M extends keyof ColonyNetworkClient>(
    methodName: M,
  ): Promise<ColonyNetworkClient[M]> {
    return Reflect.get(this.networkClient, methodName);
  }

  async getColonyMethod<M extends keyof ColonyClient>(
    methodName: M,
    identifier: AddressOrENSName,
  ): Promise<ColonyClient[M]> {
    const client = await this.getColonyClient(identifier);
    return Reflect.get(client, methodName);
  }

  async getTokenMethod<M extends keyof TokenClient>(
    methodName: M,
    identifier: AddressOrENSName,
  ): Promise<TokenClient[M]> {
    const client = await this.getColonyClient(identifier);
    return Reflect.get(client.tokenClient, methodName);
  }

  async getEstimationMethod<
    C extends ClientType,
    M extends keyof ContractClient['estimate']
  >(
    context: C,
    methodName: M,
    identifier?: AddressOrENSName,
  ): Promise<ContractClient['estimate'][M]> {
    switch (context) {
      case ClientType.ColonyClient: {
        if (!identifier) throw new Error('Need identifier for Colony methods');
        const client = await this.getColonyClient(identifier);
        // FIXME will this work without reflect? Do we need to bind it???
        return Reflect.get(client.estimate, methodName);
      }
      case ClientType.NetworkClient: {
        return Reflect.get(this.networkClient.estimate, methodName);
      }
      case ClientType.TokenClient: {
        if (!identifier) throw new Error('Need identifier for Colony methods');
        const client = await this.getColonyClient(identifier);
        return Reflect.get(client.tokenClient.estimate, methodName);
      }
      default: {
        throw new Error('No valid context specified');
      }
    }
  }

  async getMethod<C extends ClientType, M extends keyof ContractClient>(
    context: C,
    methodName: M,
    identifier?: AddressOrENSName,
  ): Promise<ContractClient[M]> {
    switch (context) {
      case ClientType.ColonyClient: {
        if (!identifier) throw new Error('Need identifier for Colony methods');
        return this.getColonyMethod(methodName, identifier);
      }
      case ClientType.TokenClient: {
        if (!identifier) {
          throw new Error('Need Colony identifier for Token methods');
        }
        return this.getTokenMethod(methodName, identifier);
      }
      case ClientType.NetworkClient: {
        return this.getNetworkMethod(methodName);
      }
      default: {
        throw new Error('No valid context specified');
      }
    }
  }
}
