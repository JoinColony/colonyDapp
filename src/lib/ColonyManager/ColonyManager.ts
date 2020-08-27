import { Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import {
  getTokenClient,
  ClientType,
  CoinMachineClient,
  CoinMachineFactoryClient,
  ColonyClient,
  ContractClient,
  ColonyNetworkClient,
  OneTxPaymentClient,
  OneTxPaymentFactoryClient,
  TokenClient,
  ColonyVersion,
} from '@colony/colony-js';

import ENS from '~lib/ENS';
import { isAddress } from '~utils/web3';
import { Address, AddressOrENSName } from '~types/index';

import ens from '../../context/ensContext';

export default class ColonyManager {
  private metaColonyClient?: ColonyClient;

  colonyClients: Map<Address, Promise<ColonyClient>>;

  tokenClients: Map<Address, Promise<TokenClient>>;

  networkClient: ColonyNetworkClient;

  provider: Provider;

  signer: Signer;

  constructor(networkClient: ColonyNetworkClient) {
    this.colonyClients = new Map();
    this.tokenClients = new Map();
    this.networkClient = networkClient;
    this.provider = networkClient.provider;
    this.signer = networkClient.signer;
  }

  private async getColonyPromise(address: Address) {
    const client = await this.networkClient.getColonyClient(address);

    // Check if the colony exists by calling `version()` (in lieu of an
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
    return this.colonyClients.get(address) || this.setColonyClient(address);
  }

  private async resolveColonyIdentifier(
    identifier: AddressOrENSName,
  ): Promise<any> {
    return isAddress(identifier)
      ? identifier
      : ens.getAddress(
          ENS.getFullDomain('colony', identifier),
          this.networkClient,
        );
  }

  async setColonyClient(address: Address): Promise<ColonyClient> {
    const clientPromise = this.getColonyPromise(address);
    this.colonyClients.set(address, clientPromise);
    clientPromise.catch(() => this.colonyClients.delete(address));
    return clientPromise;
  }

  async getMetaColonyClient(): Promise<ColonyClient> {
    if (this.metaColonyClient) return this.metaColonyClient;
    this.metaColonyClient = await this.networkClient.getMetaColonyClient();
    return this.metaColonyClient;
  }

  async getClient(type: ClientType.NetworkClient): Promise<ColonyNetworkClient>;

  async getClient(
    type: ClientType.ColonyClient,
    identifier?: AddressOrENSName,
  ): Promise<ColonyClient>;

  async getClient(
    type: ClientType.TokenClient,
    identifier?: AddressOrENSName,
  ): Promise<TokenClient>;

  async getClient(
    type: ClientType.OneTxPaymentFactoryClient,
  ): Promise<OneTxPaymentFactoryClient>;

  async getClient(
    type: ClientType.OneTxPaymentClient,
    identifier?: AddressOrENSName,
  ): Promise<OneTxPaymentClient>;

  async getClient(
    type: ClientType.CoinMachineClient,
    identifier?: AddressOrENSName,
  ): Promise<CoinMachineClient>;

  async getClient(
    type: ClientType.CoinMachineFactoryClient,
    identifier?: AddressOrENSName,
  ): Promise<CoinMachineFactoryClient>;

  async getClient(
    type: ClientType,
    identifier?: AddressOrENSName,
  ): Promise<ContractClient>;

  async getClient(
    type: ClientType,
    identifier?: AddressOrENSName,
  ): Promise<ContractClient> {
    switch (type) {
      case ClientType.NetworkClient: {
        return this.networkClient;
      }
      case ClientType.ColonyClient: {
        return this.getColonyClient(identifier);
      }
      case ClientType.TokenClient: {
        const colonyClient = await this.getColonyClient(identifier);
        return colonyClient.tokenClient;
      }
      case ClientType.OneTxPaymentFactoryClient: {
        return this.networkClient.oneTxPaymentFactoryClient;
      }
      case ClientType.OneTxPaymentClient: {
        const colonyClient = await this.getColonyClient(identifier);
        if (!colonyClient.oneTxPaymentClient) {
          throw new Error(
            'OneTxPayment extension not installed on this colony',
          );
        }
        return colonyClient.oneTxPaymentClient;
      }
      case ClientType.CoinMachineFactoryClient: {
        return this.networkClient.coinMachineFactoryClient;
      }
      case ClientType.CoinMachineClient: {
        const colonyClient = await this.getColonyClient(identifier);
        if (
          colonyClient.clientVersion !==
          ColonyVersion.CeruleanLightweightSpaceship
        ) {
          throw new Error(
            'Coin Machine is not supported on this version of colony',
          );
        }
        if (!colonyClient.coinMachineClient) {
          throw new Error('CoinMachine extension not installed on this colony');
        }
        return colonyClient.coinMachineClient;
      }
      default: {
        throw new Error('A valid contract client type has to be specified');
      }
    }
  }

  async getTokenClient(address: Address): Promise<TokenClient> {
    let clientPromise = this.tokenClients.get(address);
    if (!clientPromise) {
      clientPromise = getTokenClient(address, this.signer);
      this.tokenClients.set(address, clientPromise);
    }
    return clientPromise;
  }
}
