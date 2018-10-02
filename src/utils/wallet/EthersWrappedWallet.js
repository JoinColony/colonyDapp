/* @flow */

import BigNumber from 'bn.js';
import { utils } from 'ethers';

type Transaction = {
  // Exactly one of these will be present (send vs. deploy contract)
  creates?: string | null,
  to?: string | null,

  // The transaction hash
  hash: string,

  // The transaction request
  data: string,
  from: string,
  gasLimit: BigNumber,
  gasPrice: BigNumber,
  nonce: number,
  value: BigNumber,

  // The network ID (or chain ID); 0 indicates replay-attack vulnerable
  // (eg. 1 = Homestead mainnet, 3 = Ropsten testnet)
  networkId: number,

  // The raw transaction
  raw: string,
};

type SignedTransaction = Transaction & {
  r: string,
  s: string,
  v: number,
};

type TransactionOptions = {
  gasLimit?: number,
  gasPrice?: number,
  nonce?: number,
  value?: BigNumber,
};

type TransactionReceipt = {
  blockHash: string,
  blockNumber: number,
  contractAddress: string | null,
  cumulativeGasUsed: BigNumber,
  gasUsed: BigNumber,
  hash: string,
  logs: Array<*>,
  logsBloom: string,
  root: string,
  status: number, // 0 => failure, 1 => success
  transactionHash: string,
  transactionIndex: number,
};

export default class EthersWrappedWallet {
  _wallet: *;

  provider: *;

  constructor(wallet: *, provider: *) {
    this._wallet = wallet;
    this.provider = provider;
  }

  async getAddress(): Promise<string> {
    return this._wallet.address;
  }

  async signMessage(message: string): Promise<string> {
    const messageString = utils.isArrayish(message)
      ? utils.toUtf8String(message)
      : message;
    return this._wallet.signMessage({ message: messageString });
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
    const signedTx = this._wallet.sign(
      Object.assign(
        {
          gasPrice: new BigNumber(gasPrice),
          gasLimit: new BigNumber(gasLimit),
          chainId,
          inputData,
          ...tx,
        },
        {
          gasPrice: new BigNumber(gasPriceOption),
          gasLimit: new BigNumber(gasLimitOption),
          ...options,
        },
      ),
    );
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
    const signedTx = this._wallet.sign({
      gasPrice,
      gasLimit,
      nonce,
      to: addressOrName,
      value: new BigNumber(amountWei),
    });
    return this.provider.sendTransaction(signedTx);
  }

  async sign({ data, ...tx }: Transaction): Promise<SignedTransaction> {
    const signedTxString = await this._wallet.sign({ ...tx, inputData: data });
    const signedTx = utils.splitSignature(signedTxString);
    return {
      data,
      ...tx,
      ...signedTx,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  verifyMessage(message: string, signature: string): string {
    return utils.verifyMessage(message, signature);
  }

  // not available with Purser
  privateKey: string;

  // eslint-disable-next-line class-methods-use-this
  encrypt() {
    throw new Error('Wallet method "encrypt" not available');
  }
}
