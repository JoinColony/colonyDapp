/* @flow */

import type { TransactionType } from '~immutable';

/*
 * Transactions
 */
export const isMultisig = (tx: TransactionType<*, *>) => !!tx.multisig;
export const isPendingMultisig = (tx: TransactionType<*, *>) =>
  !!tx.multisig &&
  !(tx.multisig.missingSignees && tx.multisig.missingSignees.length);
