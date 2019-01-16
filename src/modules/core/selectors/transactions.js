/* @flow */

import { createSelector } from 'reselect';

import ns from '../namespace';

import type { RootState } from '~types';
import type { TransactionRecord } from '~immutable';

import type { TransactionsState } from '../types';

type TransactionSelector = (tx: TransactionRecord<*, *>) => boolean;
type TransactionsSelector = (state: RootState) => TransactionsState;
type OneTransactionSelector = (
  state: RootState,
  id: string,
) => ?TransactionRecord<*, *>;

/**
 * Individual transaction selectors
 */
const isOutgoing: TransactionSelector = ({ hash }) => !!hash;
const isPending: TransactionSelector = ({ hash }) => !hash;
// TODO for `isConfirmed`, ideally we should count the confirmations and
// ensure that a minimum threshold is met.
const isConfirmed: TransactionSelector = tx =>
  !!(tx.receiptReceived && Object.hasOwnProperty.call(tx, 'eventData'));
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
export const allTransactions: TransactionsSelector = state =>
  state[ns].transactions;
export const oneTransaction: OneTransactionSelector = (state, id) =>
  state[ns].transactions.get(id);
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
