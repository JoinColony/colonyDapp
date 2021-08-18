import { FormattedMessage, defineMessages } from 'react-intl';
import React from 'react';
import { bigNumberify, BigNumberish } from 'ethers/utils';

import { PeriodTokensType } from '~dashboard/CoinMachine/RemainingDisplayWidget';
import { TokenPriceStatuses } from '~dashboard/CoinMachine/TokenPriceStatusIcon';

import { getFormattedTokenValue } from './tokens';

const MSG = defineMessages({
  soldOut: {
    id: 'dashboard.CoinMachine.soldOut',
    defaultMessage: 'SOLD OUT',
  },
});

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

export const getFormattedTokensRemaining = (
  periodTokens: PeriodTokensType,
  tokensBought: BigNumberish,
) => {
  const { maxPeriodTokens, decimals } = periodTokens;

  if (bigNumberify(tokensBought).gte(maxPeriodTokens)) {
    return <FormattedMessage {...MSG.soldOut} />;
  }

  return `${getFormattedTokenValue(
    maxPeriodTokens.sub(tokensBought),
    decimals,
  )}/${getFormattedTokenValue(maxPeriodTokens, decimals)}`;
};
