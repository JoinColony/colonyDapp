import { bigNumberify, BigNumberish } from 'ethers/utils';

import { PeriodTokensType } from '~dashboard/CoinMachine/RemainingDisplayWidget';
import { TokenPriceStatuses } from '~dashboard/CoinMachine/TokenPriceStatusIcon';

export const getPriceStatus = (
  periodTokens: PeriodTokensType,
  tokensBought: BigNumberish,
) => {
  const { maxPeriodTokens, targetPeriodTokens } = periodTokens;

  if (bigNumberify(tokensBought).gte(maxPeriodTokens)) {
    return TokenPriceStatuses.PRICE_SOLD_OUT;
  }

  if (bigNumberify(tokensBought).eq(targetPeriodTokens)) {
    return TokenPriceStatuses.PRICE_NO_CHANGES;
  }

  if (bigNumberify(tokensBought).lt(targetPeriodTokens)) {
    return TokenPriceStatuses.PRICE_DOWN;
  }

  if (bigNumberify(tokensBought).gt(targetPeriodTokens)) {
    return TokenPriceStatuses.PRICE_UP;
  }

  return undefined;
};
