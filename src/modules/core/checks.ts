import { AddressZero } from 'ethers/constants';

import { TransactionType } from '~immutable/index';
import { TokenWithBalances, AnyToken } from '~data/index';
import { getBalanceFromToken } from '~utils/tokens';

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
  token: TokenWithBalances,
  domainId: number,
) => {
  const balance = getBalanceFromToken(token, domainId);
  return balance.gte(0);
};

export const tokenBalanceIsNotPositive = (
  token: TokenWithBalances,
  domainId: number,
) => {
  const balance = getBalanceFromToken(token, domainId);
  return balance.lte(0);
};

export const tokenIsETH = ({ address }: AnyToken) => address === AddressZero;
