/* @flow */

import type { GenericWallet } from '@colony/purser-core/es';

import BigNumber from 'bn.js';
import { utils } from 'ethers';

import type {
  Transaction,
  TransactionOptions,
  TransactionReceipt,
} from './types';

export default class EthersWrappedWallet {
  wallet: GenericWallet;

  provider: *;

  constructor(wallet: *, provider: *) {
    this.wallet = wallet;
    this.provider = provider;
  }

  async getAddress(): Promise<string> {
    return this.wallet.address;
  }

  async signMessage(message: string): Promise<string> {
    const messageString = utils.isArrayish(message)
      ? utils.toUtf8String(message)
      : message;
    return this.wallet.signMessage({ message: messageString });
  }

  async sendTransaction(
    {
      gasLimit,
      gasPrice,
      data: inputData,
      networkId: chainId,
      ...tx
    }: Transaction,
    {
      gasPrice: gasPriceOption,
      gasLimit: gasLimitOption,
      ...options
    }: TransactionOptions = {},
  ): Promise<TransactionReceipt> {
    const signOptions = {
      gasPrice: new BigNumber(gasPrice),
      gasLimit: new BigNumber(gasLimit),
      chainId,
      inputData,
      ...tx,
      ...options,
    };

    if (gasPriceOption) signOptions.gasPrice = new BigNumber(gasPriceOption);
    if (gasLimitOption) signOptions.gasLimit = new BigNumber(gasLimitOption);

    const signedTx = await this.sign(signOptions);
    return this.provider.sendTransaction(signedTx);
  }

  async estimateGas(tx: Transaction): Promise<BigNumber> {
    return this.provider.estimateGas(tx);
  }

  async getBalance(): Promise<BigNumber> {
    return this.provider.getBalance(await this.getAddress());
  }

  async getTransactionCount(): Promise<number> {
    return this.provider.getTransactionCount(await this.getAddress());
  }

  // eslint-disable-next-line class-methods-use-this
  parseTransaction(tx: string): Transaction {
    return utils.parseTransaction(tx);
  }

  async send(
    addressOrName: string,
    amountWei: string,
    { gasPrice, gasLimit, nonce }: TransactionOptions = {},
  ): Promise<TransactionReceipt> {
    const signedTx = await this.sign({
      gasPrice,
      gasLimit,
      nonce,
      to: addressOrName,
      value: new BigNumber(amountWei),
    });
    return this.provider.sendTransaction(signedTx);
  }

  async sign({ data, ...tx }: Transaction): Promise<string> {
    return this.wallet.sign({ ...tx, inputData: data });
  }

  // eslint-disable-next-line class-methods-use-this
  verifyMessage(message: string, signature: string): string {
    return utils.verifyMessage(message, signature);
  }

  // eslint-disable-next-line class-methods-use-this
  encrypt() {
    throw new Error('Wallet method "encrypt" not available');
  }

  // eslint-disable-next-line class-methods-use-this
  get privateKey() {
    throw new Error('Wallet property "privateKey" not available');
  }

  // eslint-disable-next-line class-methods-use-this
  set privateKey(privateKey: any) {
    throw new Error('Wallet property "privateKey" not available');
  }
}
