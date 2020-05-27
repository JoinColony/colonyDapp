import { Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import {
  getTokenClient,
  ClientType,
  ColonyClient,
  ContractClient,
  NetworkClient,
  TokenClient,
} from '@colony/colony-js';
import { isAddress } from 'web3-utils';

import ENS from '~lib/ENS';
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
      case ClientType.NetworkClient: {
        // FIXME fix this
        // @ts-ignore
        return this.networkClient;
      }
      case ClientType.ColonyClient: {
        // FIXME fix this
        // @ts-ignore
        return this.getColonyClient(identifier);
      }
      case ClientType.TokenClient: {
        const colonyClient = await this.getColonyClient(identifier);
        // FIXME fix this
        // @ts-ignore
        return colonyClient.tokenClient;
      }
      case ClientType.OneTxPaymentFactoryClient: {
        // FIXME fix this
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

  // async getNetworkMethod<M extends keyof ColonyNetworkClient>(
  //   methodName: M,
  // ): Promise<ColonyNetworkClient[M]> {
  //   return Reflect.get(this.networkClient, methodName);
  // }

  // async getColonyMethod<M extends keyof ColonyClient>(
  //   methodName: M,
  //   identifier: AddressOrENSName,
  // ): Promise<ColonyClient[M]> {
  //   const client = await this.getColonyClient(identifier);
  //   return Reflect.get(client, methodName);
  // }

  // async getTokenMethod<M extends keyof TokenClient>(
  //   methodName: M,
  //   identifier: AddressOrENSName,
  // ): Promise<TokenClient[M]> {
  //   const client = await this.getColonyClient(identifier);
  //   return Reflect.get(client.tokenClient, methodName);
  // }

  // FIXME get the types right for this
  // async getEstimationMethod<
  //   C extends ClientType
  //   // M extends keyof ContractClient['estimate']
  // >(
  //   context: C,
  //   // FIXME M
  //   methodName: any,
  //   identifier?: AddressOrENSName,
  //   // FIXME any
  // ): Promise<any> {
  //   switch (context) {
  //     case ClientType.ColonyClient: {
  //       if (!identifier) throw new Error('Need identifier for Colony methods');
  //       const client = await this.getColonyClient(identifier);
  //       return client.estimate[methodName].bind(client);
  //     }
  //     case ClientType.NetworkClient: {
  //       return this.networkClient.estimate[methodName].bind(this.networkClient);
  //     }
  //     case ClientType.TokenClient: {
  //       if (!identifier) throw new Error('Need identifier for Colony methods');
  //       const client = await this.getColonyClient(identifier);
  //       return client.tokenClient.estimate[methodName].bind(client.tokenClient);
  //     }
  //     case ClientType.OneTxPaymentFactoryClient: {
  //       if (!identifier) throw new Error('Need identifier for Colony methods');
  //       const client = await this.getColonyClient(identifier);
  //       return client.oneTxPaymentFactoryClient.estimate[methodName].bind(
  //         client.oneTxPaymentFactoryClient,
  //       );
  //     }
  //     case ClientType.OneTxPaymentClient: {
  //       if (!identifier) throw new Error('Need identifier for Colony methods');
  //       const client = await this.getColonyClient(identifier);
  //       return client.oneTxPaymentClient.estimate[methodName].bind(
  //         client.oneTxPaymentClient,
  //       );
  //     }
  //     default: {
  //       throw new Error('No valid context specified');
  //     }
  //   }
  // }

  // async getMethod<C extends ClientType, M extends keyof ContractClient>(
  //   context: C,
  //   methodName: M,
  //   identifier?: AddressOrENSName,
  // ): Promise<ContractClient[M]> {
  //   switch (context) {
  //     case ClientType.ColonyClient: {
  //       if (!identifier) throw new Error('Need identifier for Colony methods');
  //       return this.getColonyMethod(methodName, identifier);
  //     }
  //     case ClientType.NetworkClient: {
  //       return this.getNetworkMethod(methodName);
  //     }
  //     case ClientType.TokenClient: {
  //       if (!identifier) {
  //         throw new Error('Need Colony identifier for Token methods');
  //       }
  //       return this.getTokenMethod(methodName, identifier);
  //     }
  //     case ClientType.OneTxPaymentFactoryClient: {
  //       if (!identifier) throw new Error('Need identifier for Colony methods');
  //       const client = await this.getColonyClient(identifier);
  //       return client.oneTxPaymentFactoryClient[methodName].bind(
  //         client.oneTxPaymentFactoryClient,
  //       );
  //     }
  //     case ClientType.OneTxPaymentClient: {
  //       if (!identifier) throw new Error('Need identifier for Colony methods');
  //       const client = await this.getColonyClient(identifier);
  //       return client.oneTxPaymentClient[methodName].bind(
  //         client.oneTxPaymentClient,
  //       );
  //     }
  //     default: {
  //       throw new Error('No valid context specified');
  //     }
  //   }
  // }
}
