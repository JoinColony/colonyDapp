/* @flow */

import type BigNumber from 'bn.js';

export type TransactionRequest = {
  chainId?: number,
  data?: string,
  gasLimit?: number | BigNumber,
  gasPrice?: number | BigNumber,
  nonce?: number,
  to?: string,
  value?: BigNumber,
};

export type TransactionOptions = {
  gasLimit?: number,
  gasPrice?: number,
  nonce?: number,
  value?: BigNumber,
};

export type TransactionReceipt = {
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
