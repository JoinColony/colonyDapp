import { bigNumberify, BigNumberish } from 'ethers/utils';

import { PeriodTokensType } from './RemainingDisplayWidgets';
import { TokenPriceStatuses } from './TokenPriceStatusIcon';

export const getPriceStatus = (
  periodTokens: Required<PeriodTokensType>,
  tokensBought: BigNumberish,
  isOnlyHigherNeeded = false,
) => {
  const { maxPeriodTokens, targetPeriodTokens } = periodTokens;

  if (bigNumberify(tokensBought).gte(maxPeriodTokens)) {
    return TokenPriceStatuses.PRICE_SOLD_OUT;
  }

  if (bigNumberify(tokensBought).gt(targetPeriodTokens)) {
    return TokenPriceStatuses.PRICE_UP;
  }

  if (
    isOnlyHigherNeeded &&
    (bigNumberify(tokensBought).eq(targetPeriodTokens) ||
      bigNumberify(tokensBought).lt(targetPeriodTokens))
  ) {
    return undefined;
  }

  if (bigNumberify(tokensBought).eq(targetPeriodTokens)) {
    return TokenPriceStatuses.PRICE_NO_CHANGES;
  }

  if (bigNumberify(tokensBought).lt(targetPeriodTokens)) {
    return TokenPriceStatuses.PRICE_DOWN;
  }

  return undefined;
};
