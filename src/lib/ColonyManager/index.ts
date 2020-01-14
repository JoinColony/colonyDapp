import ColonyNetworkClient from '@colony/colony-js-client';
import TokenClient from '@colony/colony-js-client/lib/TokenClient';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { isAddress } from 'web3-utils';

import ENS from '~lib/ENS';
import { Address, AddressOrENSName } from '~types/index';

import { ContractContexts } from './types';
import tokenABILoader from './tokenABILoader';
import ens from '../../context/ensContext';

export default class ColonyManager {
  clients: Map<Address, Promise<ColonyNetworkClient.ColonyClient>>;

  _metaColonyClient: ColonyNetworkClient.ColonyClient;

  networkClient: ColonyNetworkClient;

  constructor(networkClient: ColonyNetworkClient) {
    this.clients = new Map();
    this.networkClient = networkClient;
  }

  private async getColonyPromise(address: Address) {
    const client = await this.networkClient.getColonyClientByAddress(address);

    // Check if the colony exists by calling `getVersion` (in lieu of an
    // explicit means of checking whether a colony exists at an address).
    try {
      await client.getVersion.call();
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

  async setColonyClient(address: Address) {
    const clientPromise = this.getColonyPromise(address);

    this.clients.set(address, clientPromise);
    return clientPromise.catch(() => this.clients.delete(address));
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

  /**
   * Given a token contract address, create a `TokenClient` with the minimal
   * token ABI loader and return it. The promise will be rejected if
   * the functions do not exist on the contract.
   */
  async getTokenClient(contractAddress: string) {
    const adapter = new EthersAdapter({
      loader: tokenABILoader,
      provider: this.networkClient.adapter.provider,
      wallet: this.networkClient.adapter.wallet,
    });

    const client = new TokenClient({
      adapter,
      query: { contractAddress },
      verbose: false,
    });

    await client.init();

    return client;
  }

  getNetworkMethod(methodName: string) {
    return Reflect.get(this.networkClient, methodName);
  }

  async getColonyMethod(methodName: string, identifier?: AddressOrENSName) {
    const client = await this.getColonyClient(identifier);
    return Reflect.get(client, methodName);
  }

  async getTokenMethod(methodName: string, identifier?: AddressOrENSName) {
    const client = await this.getColonyClient(identifier);
    return Reflect.get(client.tokenClient, methodName);
  }

  /*
   * @note This typing isn't perfect; it would be better to use something like
   * `$PropertyType<ColonyNetworkClient, methodName>` but the key needs to
   * be a string literal.
   */
  async getMethod<
    M extends
      | ColonyNetworkClient.Caller<any, any, any>
      | ColonyNetworkClient.Sender<any, any, any>
      | ColonyNetworkClient.ColonyClient.Caller<any, any, any>
      | ColonyNetworkClient.ColonyClient.Sender<any, any, any>
      | ColonyNetworkClient.ColonyClient.TokenClient.Caller<any, any, any>
      | ColonyNetworkClient.ColonyClient.TokenClient.Sender<any, any, any>
  >(
    context: ContractContexts,
    methodName: string,
    identifier?: AddressOrENSName,
  ): Promise<M> {
    let method;
    switch (context) {
      case ContractContexts.COLONY_CONTEXT:
        method = this.getColonyMethod(methodName, identifier);
        break;
      case ContractContexts.NETWORK_CONTEXT:
        method = this.getNetworkMethod(methodName);
        break;
      case ContractContexts.TOKEN_CONTEXT:
        method = this.getTokenMethod(methodName, identifier);
        break;
      default:
        throw new Error(`Unknown context: ${context}`);
    }
    if (!method) {
      throw new Error(`Method ${methodName} not found on ${context}`);
    }
    return method;
  }
}
