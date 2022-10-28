import { bigNumberify, BigNumberish } from 'ethers/utils';
import Decimal from 'decimal.js';

import { minimalFormatter } from '~utils/numbers';
import { TokenWithBalances, UserLock } from '~data/index';
import { DEFAULT_TOKEN_DECIMALS, SMALL_TOKEN_AMOUNT_FORMAT } from '~constants';
import { UserTokenBalanceData } from '~types/tokens';

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

  // Testing Dev: add/remove to catch small numbers here
  // or let numbro handle it in numberFormatter.
  if (decimalValue.lt(0.00001) && decimalValue.gt(0)) {
    return SMALL_TOKEN_AMOUNT_FORMAT;
  }

  return minimalFormatter({
    value: decimalValue.toString(),
  });
};

export const getUserTokenBalanceData = (userLock: UserLock | undefined) => {
  const nativeToken = userLock?.nativeToken;
  const inactiveBalance = bigNumberify(nativeToken?.balance || 0);
  const lockedBalance = bigNumberify(userLock?.totalObligation || 0);
  const activeBalance = bigNumberify(userLock?.activeTokens || 0);
  const totalBalance = inactiveBalance.add(activeBalance).add(lockedBalance);
  const isPendingBalanceZero = bigNumberify(
    userLock?.pendingBalance || 0,
  ).isZero();

  return {
    nativeToken,
    inactiveBalance,
    lockedBalance,
    activeBalance,
    totalBalance,
    isPendingBalanceZero,
  } as UserTokenBalanceData;
};
