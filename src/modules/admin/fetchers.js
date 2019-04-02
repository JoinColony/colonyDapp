/* @flow */

import {
  colonyTransactionsSelector,
  colonyUnclaimedTransactionsSelector,
} from './selectors';
import {
  fetchColonyTransactions,
  fetchColonyUnclaimedTransactions,
} from './actionCreators';

export const colonyTransactionsFetcher = {
  select: colonyTransactionsSelector,
  fetch: fetchColonyTransactions,
  ttl: 1000 * 60, // 1 minute
};

export const colonyUnclaimedTransactionsFetcher = {
  select: colonyUnclaimedTransactionsSelector,
  fetch: fetchColonyUnclaimedTransactions,
  ttl: 1000 * 60, // 1 minute
};
