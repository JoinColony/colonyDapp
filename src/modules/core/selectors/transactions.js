/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import type { RootStateRecord, TransactionRecordType } from '~immutable';

import { walletAddressSelector } from '../../users/selectors';
import { isMultisig, isPendingMultisig } from '../checks';

import {
  CORE_NAMESPACE as ns,
  CORE_TRANSACTIONS,
  CORE_TRANSACTIONS_LIST,
} from '../constants';

/*
 * Transactions sorting functions.
 */
const createdAtDesc = (
  { createdAt: createdAtA }: TransactionRecordType<*, *>,
  { createdAt: createdAtB }: TransactionRecordType<*, *>,
) => createdAtB - createdAtA;

/*
 * Transactions selectors.
 */
export const oneTransaction = (state: RootStateRecord, id: string) =>
  state.getIn([ns, CORE_TRANSACTIONS, CORE_TRANSACTIONS_LIST, id]);

export const allTransactions = createSelector(
  (state: RootStateRecord) =>
    state.getIn(
      [ns, CORE_TRANSACTIONS, CORE_TRANSACTIONS_LIST],
      ImmutableMap(),
    ),
  walletAddressSelector,
  (transactions, walletAddress) =>
    transactions.filter(tx => tx.from === walletAddress),
);

export const transactionByHash = (state: RootStateRecord, hash: string) =>
  createSelector(
    allTransactions,
    transactions => transactions.find(tx => tx.hash === hash),
  )(state);

export const groupedTransactions = createSelector(
  allTransactions,
  transactions =>
    transactions
      // Create groups of transations which have 'em
      .groupBy(tx => tx.group && tx.group.id)
      // Convert groups to lists and sort by no in group
      .map(txGroup => txGroup.toList().sortBy(tx => tx.group && tx.group.index))
      // Merge the ungrouped transactions into the ordered map. It's important that all iterators here have the same type (OrderedMap)
      // For proper typing we create single value arrays for all of the single transactions
      // We're using key.toString() here to not confuse flow. The output of allTransactions always has a string id in group
      .flatMap((value, key) =>
        !key
          ? value.groupBy(tx => tx.id)
          : ImmutableMap({ [key.toString()]: value }),
      )
      .toList()
      // Finally sort by the createdAt field in the first transaction of the group
      .sortBy(group => group.first().createdAt),
);

export const pendingTransactions = createSelector(
  allTransactions,
  transactions =>
    transactions.filter(tx => tx.status === 'pending').sort(createdAtDesc),
);

export const multisigTransactions = createSelector(
  allTransactions,
  transactions => transactions.filter(isMultisig).sort(createdAtDesc),
);

export const pendingMultisigTransactions = createSelector(
  allTransactions,
  transactions => transactions.filter(isPendingMultisig).sort(createdAtDesc),
);
