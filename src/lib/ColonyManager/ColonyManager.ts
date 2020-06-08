import { Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import {
  getTokenClient,
  ClientType,
  ColonyClient,
  // ContractClient,
  NetworkClient,
  TokenClient,
} from '@colony/colony-js';

import ENS from '~lib/ENS';
import { isAddress } from '~utils/web3';
import { Address, AddressOrENSName } from '~types/index';

import ens from '../../context/ensContext';

export default class ColonyManager {
  private metaColonyClient?: ColonyClient;

  clients: Map<Address, Promise<ColonyClient>>;

  networkClient: NetworkClient;

  provider: Provider;

  signer: Signer;

  constructor(networkClient: NetworkClient) {
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

  private async getColonyClient(
    identifier?: AddressOrENSName,
  ): Promise<ColonyClient> {
    if (!(typeof identifier === 'string' && identifier.length)) {
      throw new Error('A colony address or ENS name must be provided');
    }

    const address = await this.resolveColonyIdentifier(identifier);
    return this.clients.get(address) || this.setColonyClient(address);
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

  async getClient<T extends ClientType>(
    type: T,
    identifier?: AddressOrENSName,
  ): Promise<
    T extends ClientType.ColonyClient
      ? ColonyClient
      : T extends ClientType.NetworkClient
      ? NetworkClient
      : TokenClient
  > {
    switch (type) {
      // @TODO: Somehow it should be possible to fix these types
      // See https://www.typescriptlang.org/play/?#code/MYewdgzgLgBA5gUygNQIYBsCuCYF4YA8AUDDAMIwIAeUCYAJhDAOTQBOAlmHMzAD4swmALYAjBG2YAaIgD4AFMAAqATwAOCAFzkAlNvkVqtBk1ZRO3XgH4Y7LnBjahYiTryyYAbxIwOAMxhFVQ08fDMLHjdvUlI2JEw2MBZUW3N7ZgBuHwBfSnQIHH9A5XUcXDDncUkon1j4xJgAVizSbJ84qASkoXR0LOysolBIWCo8eCQ0LAR5ZkqJZh0gA
      case ClientType.NetworkClient: {
        // @ts-ignore
        return this.networkClient;
      }
      case ClientType.ColonyClient: {
        // @ts-ignore
        return this.getColonyClient(identifier);
      }
      case ClientType.TokenClient: {
        const colonyClient = await this.getColonyClient(identifier);
        // @ts-ignore
        return colonyClient.tokenClient;
      }
      case ClientType.OneTxPaymentFactoryClient: {
        // @ts-ignore
        return this.networkClient.oneTxPaymentFactoryClient;
      }
      default: {
        throw new Error('A valid contract client type has to be specified');
      }
    }
  }

  async getTokenClient(contractAddress: string) {
    return getTokenClient(contractAddress, this.signer);
  }
}
