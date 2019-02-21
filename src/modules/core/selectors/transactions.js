/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import {
  CORE_NAMESPACE as ns,
  CORE_TRANSACTIONS,
  CORE_TRANSACTIONS_LIST,
} from '../constants';

import type { RootStateRecord, TransactionRecordType } from '~immutable';

/*
 * Individual transaction selectors
 */
const isOutgoing = ({ hash }: { hash?: string }) => !!hash;
const isPending = ({ hash }: { hash?: string }) => !hash;
// TODO for `isConfirmed`, ideally we should count the confirmations and
// ensure that a minimum threshold is met.
const isConfirmed = tx =>
  !!(tx.receipt && Object.hasOwnProperty.call(tx, 'eventData'));
const isMultisig = tx => !!tx.multisig;
const isPendingMultisig = tx =>
  !!tx.multisig &&
  !(tx.multisig.missingSignees && tx.multisig.missingSignees.length);

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

export const allTransactions = (state: RootStateRecord) =>
  state.getIn([ns, CORE_TRANSACTIONS, CORE_TRANSACTIONS_LIST], ImmutableMap());

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
  transactions => transactions.filter(isPending).sort(createdAtDesc),
);

export const outgoingTransactions = createSelector(
  allTransactions,
  transactions =>
    transactions
      .filter(tx => isOutgoing(tx) && !isConfirmed(tx))
      .sort(createdAtDesc),
);

export const confirmedTransactions = createSelector(
  allTransactions,
  transactions => transactions.filter(isConfirmed).sort(createdAtDesc),
);

export const multisigTransactions = createSelector(
  allTransactions,
  transactions => transactions.filter(isMultisig).sort(createdAtDesc),
);

export const pendingMultisigTransactions = createSelector(
  allTransactions,
  transactions => transactions.filter(isPendingMultisig).sort(createdAtDesc),
);
