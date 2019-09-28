import {
  ColonyTokenReferenceType,
  TokenType,
  TransactionType,
  UserTokenReferenceType,
} from '~immutable/index';

import { getTokenBalanceFromReference } from '~utils/tokens';
import { ZERO_ADDRESS } from '~utils/web3/constants';

/*
 * Transactions
 */
export const isMultisig = (tx: TransactionType) => !!tx.multisig;
export const isPendingMultisig = (tx: TransactionType) =>
  !!tx.multisig &&
  !(tx.multisig.missingSignees && tx.multisig.missingSignees.length);

/*
 * Tokens
 */
export const tokenBalanceIsPositive = (
  tokenReference: ColonyTokenReferenceType | UserTokenReferenceType,
  domainId: string,
) => {
  const balance = getTokenBalanceFromReference(tokenReference, domainId);
  return balance.gten(0);
};

export const tokenBalanceIsNotPositive = (
  tokenReference: ColonyTokenReferenceType | UserTokenReferenceType,
  domainId: string,
) => {
  const balance = getTokenBalanceFromReference(tokenReference, domainId);
  return balance.lten(0);
};

export const tokenIsETH = ({
  address,
}: TokenType | ColonyTokenReferenceType | UserTokenReferenceType) =>
  address === ZERO_ADDRESS;
