import { bigNumberify, BigNumberish } from 'ethers/utils';
import Decimal from 'decimal.js';

import { stdNumberFormatter } from '~utils/numbers';
import { TokenWithBalances } from '~data/index';
import { DEFAULT_TOKEN_DECIMALS, SMALL_TOKEN_AMOUNT_FORMAT } from '~constants';

export const getBalanceFromToken = (
  token: TokenWithBalances | undefined,
  tokenDomainId = 0,
) => {
  let result;
  if (!token) return bigNumberify(0);
  if ('balances' in token) {
    const domainBalance = token.balances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    result = domainBalance ? domainBalance.amount : 0;
  } else if ('processedBalances' in token) {
    const domainBalance = token.processedBalances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    result = domainBalance ? domainBalance.amount : 0;
  } else if ('balance' in token) {
    result = token.balance;
  } else {
    result = 0;
  }
  return bigNumberify(result);
};

/*
 * @NOTE Don't trust the incoming decimals
 *
 * The incoming decimals can be virtually anything, so we have to test if it's
 * a number, and return that number (even if that number is 0).
 * If it's not a number then fallback to the default token decimals value.
 */
export const getTokenDecimalsWithFallback = (
  decimals: any,
  fallbackDecimals?: any,
): number => {
  if (Number.isInteger(decimals) && decimals >= 0) {
    return decimals;
  }
  if (Number.isInteger(fallbackDecimals) && fallbackDecimals >= 0) {
    return fallbackDecimals;
  }
  return DEFAULT_TOKEN_DECIMALS;
};

export const getFormattedTokenValue = (
  value: BigNumberish,
  decimals: any,
): string => {
  const safeDecimals = bigNumberify(10)
    .pow(getTokenDecimalsWithFallback(decimals))
    .toString();
  const decimalValue = new Decimal(bigNumberify(value).toString()).div(
    safeDecimals,
  );

  if (decimalValue.lt(0.00001) && decimalValue.gt(0)) {
    return SMALL_TOKEN_AMOUNT_FORMAT;
  }
  return decimalValue.toDP(5, Decimal.ROUND_DOWN).toString();
};

export const getStdFormattedTokenValue = (
  value: BigNumberish,
  decimals: any,
): string => {
  const safeDecimals = bigNumberify(10)
    .pow(getTokenDecimalsWithFallback(decimals))
    .toString();
  const decimalValue = new Decimal(bigNumberify(value).toString())
    .div(safeDecimals)
    .toString();

  return stdNumberFormatter({
    abreviateOverMillion: false,
    suffix: '',
    value: decimalValue,
  });
};
