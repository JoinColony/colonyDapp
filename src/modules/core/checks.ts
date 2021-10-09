import { AddressZero } from 'ethers/constants';

import { TokenWithBalances, AnyToken } from '~data/index';
import { getBalanceFromToken } from '~utils/tokens';

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
