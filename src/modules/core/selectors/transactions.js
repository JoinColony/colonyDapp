/* @flow */

import { createSelector } from 'reselect';

import { Map as ImmutableMap } from 'immutable';

import {
  CORE_NAMESPACE as ns,
  CORE_TRANSACTIONS,
  CORE_GAS_PRICES,
  CORE_TRANSACTIONS_LIST,
} from '../constants';

import type {
  RootStateRecord,
  TransactionRecord,
  TransactionId,
} from '~immutable';

/**
 * Individual transaction selectors
 */
const isOutgoing = ({ hash }) => !!hash;
const isPending = ({ hash }) => !hash;
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
  { createdAt: createdAtA }: TransactionRecord<*, *>,
  { createdAt: createdAtB }: TransactionRecord<*, *>,
) => createdAtB - createdAtA;

/*
 * Transactions selectors.
 */
export const allTransactions = (state: RootStateRecord) =>
  state.getIn([ns, CORE_TRANSACTIONS, CORE_TRANSACTIONS_LIST], ImmutableMap());

export const oneTransaction = (state: RootStateRecord, id: TransactionId) =>
  state.getIn([ns, CORE_TRANSACTIONS, CORE_TRANSACTIONS_LIST, id]);

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

/*
 * Other selectors.
 */
export const gasPrices = (state: RootStateRecord) =>
  state.getIn([ns, CORE_TRANSACTIONS, CORE_GAS_PRICES]);
