/* @flow */

import { List, OrderedMap } from 'immutable';

import { createSelector } from 'reselect';
import getObjectFromPath from 'lodash/get';

import ns from '../namespace';

import type { RootState } from '~types';
import type { TransactionRecord } from '~immutable';

import type { GasPrices, TransactionsState } from '../types';

type TransactionMap = $PropertyType<TransactionsState, 'list'>;
type TransactionSelector = (tx: TransactionRecord<*, *>) => boolean;
type GasPricesSelector = (state: RootState) => GasPrices;
type TransactionsSelector = (state: RootState) => TransactionMap;
type OneTransactionSelector = (
  state: RootState,
  id: string,
) => ?TransactionRecord<*, *>;
type GroupedTransactionsSelector = (
  state: RootState,
) => OrderedMap<string, List<TransactionRecord<*, *>>>;

/**
 * Helpers for transaction transformations
 */
const transactionGroup = (tx: TransactionRecord<*, *>) => {
  if (!tx.group || typeof tx.group.id == 'string') return tx.group;
  const id = tx.group.id.reduce(
    (resultId, entry) => `${resultId}-${getObjectFromPath(tx, entry)}`,
    tx.group.key,
  );
  return {
    ...tx.group,
    id,
  };
};

/**
 * Individual transaction selectors
 */
const isOutgoing: TransactionSelector = ({ hash }) => !!hash;
const isPending: TransactionSelector = ({ hash }) => !hash;
// TODO for `isConfirmed`, ideally we should count the confirmations and
// ensure that a minimum threshold is met.
const isConfirmed: TransactionSelector = tx =>
  !!(tx.receipt && Object.hasOwnProperty.call(tx, 'eventData'));
const isMultisig: TransactionSelector = tx => !!tx.multisig;
const isPendingMultisig: TransactionSelector = tx =>
  !!tx.multisig &&
  !(tx.multisig.missingSignees && tx.multisig.missingSignees.length);

/**
 * Transactions sorting functions.
 */
const createdAtDesc = (
  { createdAt: createdAtA }: TransactionRecord<*, *>,
  { createdAt: createdAtB }: TransactionRecord<*, *>,
) => createdAtB - createdAtA;

const transformTransaction = (tx: TransactionRecord<*, *>) =>
  tx.set('group', transactionGroup(tx));

/**
 * `reselect`-powered transactions selectors.
 *
 * These can be used directly in `connect`'s `mapStateToProps`:
 *
 * connect(
 *   state => ({ pending: pendingTransactions(state) }),
 *   null,
 * )(PendingTxsComponent);
 */
export const rawTransaction: OneTransactionSelector = (state, id) =>
  state[ns].transactions.list.get(id);

export const oneTransaction: OneTransactionSelector = createSelector(
  rawTransaction,
  tx => tx && transformTransaction(tx),
);

export const rawAllTransactions: TransactionsSelector = state =>
  state[ns].transactions.list;

export const allTransactions: TransactionsSelector = createSelector(
  rawAllTransactions,
  transactions => transactions.map(transformTransaction),
);

export const groupedTransactions: GroupedTransactionsSelector = createSelector(
  allTransactions,
  transactions =>
    transactions
      // Create groups of transations which have 'em
      .groupBy(tx => tx.group && tx.group.id)
      // Convert groups to lists and sort by no in group
      .map(txGroup => txGroup.toList().sortBy(tx => tx.group && tx.group.index))
      // Convert to ordered map
      .toOrderedMap()
      // Merge the ungrouped transactions into the ordered map. It's important that all iterators here have the same type (OrderedMap)
      // For proper typing we create single value arrays for all of the single transactions
      // We're using key.toString() here to not confuse flow. The output of allTransactions always has a string id in group
      .flatMap((value, key) =>
        !key
          ? value.groupBy(tx => tx.id).toOrderedMap()
          : OrderedMap({ [key.toString()]: value }),
      )
      // Finally sort by the createdAt field in the first transaction of the group
      .sortBy(group => group.first().createdAt),
);

export const pendingTransactions: TransactionsSelector = createSelector(
  allTransactions,
  transactions => transactions.filter(isPending).sort(createdAtDesc),
);
export const outgoingTransactions: TransactionsSelector = createSelector(
  allTransactions,
  transactions =>
    transactions
      .filter(tx => isOutgoing(tx) && !isConfirmed(tx))
      .sort(createdAtDesc),
);
export const confirmedTransactions: TransactionsSelector = createSelector(
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
export const gasPrices: GasPricesSelector = state =>
  state[ns].transactions.gasPrices;
