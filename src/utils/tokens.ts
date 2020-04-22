import BigNumber from 'bn.js';

import { TokenWithBalances } from '~data/index';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

export const getBalanceFromToken = (
  token: TokenWithBalances | undefined,
  tokenDomainId = 0,
) => {
  let result;
  if (!token) return new BigNumber(0);
  if ('balances' in token) {
    const domainBalance = token.balances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    result = domainBalance ? domainBalance.amount : 0;
  } else if ('balance' in token) {
    result = token.balance;
  } else {
    result = 0;
  }
  return new BigNumber(result);
};

/*
 * @NOTE Don't trust the incoming decimals
 *
 * The incoming decimals can be virtually anything, so we have to test if it's
 * a number, and return that number (even if that number is 0).
 * If it's not a number then fallback to the default token decimals value.
 */
export const getTokenDecimals = (decimals: any): number =>
  Number.isInteger(decimals) && decimals >= 0
    ? decimals
    : DEFAULT_TOKEN_DECIMALS;
