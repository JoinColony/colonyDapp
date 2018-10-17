/* @flow */

/*
 * @NOTE This is transaction type that is to be consumed and displayed by the
 * dapp not actually the real ethereum transaction
 */

export type TransactionType = {
  type: 'pot' | 'colony' | 'task' | 'transaction',
  details?: string,
  date: any,
  from: string,
  /*
   * Left optional because of contract deployments
   */
  to?: string,
  /*
   * These two might not end up quite like this, since there's a good chance
   * we'll have to inferr the token's symbol
   */
  value: string,
  symbol: string,
};
