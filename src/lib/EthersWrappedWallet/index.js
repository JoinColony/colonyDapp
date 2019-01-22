/* @flow */

import type { GenericWallet } from '@colony/purser-core/es';

import { hexSequenceNormalizer } from '@colony/purser-core/normalizers';
import BigNumber from 'bn.js';
import EthereumTx from 'ethereumjs-tx';
import { utils } from 'ethers';

import type { TransactionOptions, TransactionRequest } from './types';
import type { TransactionReceipt } from '~types';

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

  async signMessage(message: any): Promise<string> {
    const payload =
      typeof message === 'string' && !message.match(/^(0x)?[A-Fa-f0-9]+$/)
        ? { message }
        : { messageData: message };
    return this.wallet.signMessage(payload);
  }

  /**
   * Given a partial transaction request, sets the remaining required fields,
   * signs the transaction with the Purser wallet and sends it using the
   * provider.
   */
  async sendTransaction(tx: TransactionRequest): Promise<TransactionReceipt> {
    const { chainId, data, gasLimit, gasPrice, nonce, to, value } = tx;
    const signOptions = {
      chainId: chainId || this.provider.chainId,
      data,
      gasLimit: gasLimit ? new BigNumber(gasLimit) : await this.estimateGas(tx),
      gasPrice: gasPrice ? new BigNumber(gasPrice) : await this.getGasPrice(),
      nonce: nonce || (await this.getTransactionCount()),
      to,
      value: new BigNumber(value),
    };
    const signedTx = await this.sign(signOptions);

    let txHash;
    if (this.wallet.subtype === 'metamask') {
      // if metamask, tx has already been sent
      // TODO: add `online` main wallet type or similar to Purser
      const parsedSignedTx = new EthereumTx(signedTx);
      txHash = hexSequenceNormalizer(parsedSignedTx.hash().toString('hex'));
    } else {
      // otherwise we still need to send it
      txHash = await this.provider.sendTransaction(signedTx);
    }

    return this.provider.getTransaction(txHash);
  }

  /**
   * Estimates the gas cost of a transaction using the provider and converts to
   * our BN format.
   */
  async estimateGas(tx: TransactionRequest): Promise<BigNumber> {
    // We need to properly send `from`, so that `msg.sender` will have the correct value when estimating
    const from = await this.getAddress();
    const transformedTx = { ...tx, from };
    const estimate = await this.provider.estimateGas(transformedTx);
    return new BigNumber(estimate.toString());
  }

  /**
   * Gets the gas price from the provider and converts to our BN format.
   */
  async getGasPrice(): Promise<BigNumber> {
    const price = await this.provider.getGasPrice();
    return new BigNumber(price.toString());
  }

  async getBalance(): Promise<BigNumber> {
    const address = await this.getAddress();
    return this.provider.getBalance(address);
  }

  async getTransactionCount(): Promise<number> {
    const address = await this.getAddress();
    return this.provider.getTransactionCount(address);
  }

  // eslint-disable-next-line class-methods-use-this
  parseTransaction(tx: string): Object {
    return utils.parseTransaction(tx);
  }

  async send(
    to: string,
    value: string,
    options: TransactionOptions = {},
  ): Promise<TransactionReceipt> {
    return this.sendTransaction({
      to,
      value,
      ...options,
    });
  }

  /**
   * Sign a given complete transaction request in Ethers format using Purser.
   */
  async sign({ data, ...tx }: TransactionRequest): Promise<string> {
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
