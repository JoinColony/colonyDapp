/* @flow */

import BigNumber from 'bn.js';

/*
 * @NOTE This is transaction type that is to be consumed and displayed by the
 * dapp not actually the real ethereum transaction
 */

export type TransactionType = {
  /*
   * Optional, since if the transaction has not been sent yet, it won't have a hash
   */
  hash?: string,
  /*
   * Will these transactions have nonce(s) ?
   */
  nonce: number,
  date: Date,
  /*
   * these are optional, since in case of transactions, there's no sender or
   * receiver address
   */
  from?: string,
  to?: string,
  /*
   * These two might not end up quite like this, since there's a good chance
   * we'll have to inferr the token's symbol
   */
  amount: number | string | BigNumber,
  symbol: string,
  /*
   * Augmented values
   */
  userDetails?: {
    username?: string,
    displayName?: string,
  },
  colonyDetails?: {
    name?: string,
  },
  task?: {
    id: number,
    title?: string,
  },
  /*
   * @TODO This should most likely come from a separate call to etherscan
   */
  status?: 'pending' | 'failed',
};
