/* @flow */

import {
  colonyTransactionsSelector,
  colonyUnclaimedTransactionsSelector,
} from './selectors';
import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from './actionCreators';

export const colonyTransactionsFetcher = Object.freeze({
  select: colonyTransactionsSelector,
  fetch: fetchColonyTransactions,
  ttl: 1000 * 60, // 1 minute
});

export const colonyUnclaimedTransactionsFetcher = Object.freeze({
  select: colonyUnclaimedTransactionsSelector,
  fetch: fetchColonyUnclaimedTransactions,
  ttl: 1000 * 60, // 1 minute
});
