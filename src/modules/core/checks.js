/* @flow */

import type {
  TokenReferenceType,
  TokenType,
  TransactionType,
} from '~immutable';

import { ZERO_ADDRESS } from '~utils/web3/constants';

/*
 * Transactions
 */
export const isMultisig = (tx: TransactionType<*, *>) => !!tx.multisig;
export const isPendingMultisig = (tx: TransactionType<*, *>) =>
  !!tx.multisig &&
  !(tx.multisig.missingSignees && tx.multisig.missingSignees.length);

/*
 * Tokens
 */
export const tokenBalanceIsPositive = ({ balance }: TokenReferenceType) =>
  !!balance && balance.gten(0);

export const tokenBalanceIsNotPositive = ({ balance }: TokenReferenceType) =>
  !!balance && balance.lten(0);

export const tokenIsETH = ({ address }: TokenType | TokenReferenceType) =>
  address === ZERO_ADDRESS;
