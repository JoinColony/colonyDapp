import { TransactionType } from '~immutable/index';
import { TokenWithBalances, AnyToken } from '~data/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';
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
  return balance.gten(0);
};

export const tokenBalanceIsNotPositive = (
  token: TokenWithBalances,
  domainId: number,
) => {
  const balance = getBalanceFromToken(token, domainId);
  return balance.lten(0);
};

export const tokenIsETH = ({ address }: AnyToken) => address === ZERO_ADDRESS;
