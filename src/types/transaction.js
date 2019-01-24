/* @flow */

import BigNumber from 'bn.js';

/*
 * @NOTE This is transaction type that is to be consumed and displayed by the
 * dapp not actually the real ethereum transaction
 */

export type TransactionType = {
  /*
   * Will these transactions have nonce(s) ?
   */
  id: string,
  createdAt: Date,
  methodName?: string,
  context?: string,
  gasPrice?: BigNumber,
  gasLimit?: BigNumber,
  /*
   * @TODO Below this lines, types might need to be changed
   * They were added during UI development and might not reflect
   * the current transaction format that we store in the redux store
   */
  nonce?: string,
  /*
   * Optional, since if the transaction has not been sent yet, it won't have a hash
   */
  hash?: string,
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
   * @TODO https://github.com/JoinColony/colonyDapp/issues/770 will remove TransactionType and only keep
   * TransactionRecord
   */
  params: { domain: string, username: string },
  /*
   * @TODO This should most likely come from a separate call to etherscan
   */
  status?: 'pending' | 'failed' | 'succeeded' | 'multisig',
  /*
   * @TODO The logic, for the related transactions will be added in as part of #542
   * We're just using this prop as helper to display them
   */
  dependents?: Array<TransactionType>,
  /*
   * @NOTE Used to determine if this particular action depends on a prior one being
   * executed first.
   * Most likely this will change when the *real* data comes in
   */
  dependency?: string,
};
