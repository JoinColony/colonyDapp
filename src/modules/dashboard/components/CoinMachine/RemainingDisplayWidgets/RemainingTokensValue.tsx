import { FormattedMessage, defineMessages, FormattedNumber } from 'react-intl';
import React, { useCallback, useMemo } from 'react';
import { bigNumberify, BigNumberish } from 'ethers/utils';
import Decimal from 'decimal.js';

import { PeriodTokensType } from '~dashboard/CoinMachine/RemainingDisplayWidgets';
import { getFormattedTokenValue } from '~utils/tokens';

const MSG = defineMessages({
  soldOut: {
    id: `dashboard.CoinMachine.RemainingDisplayWidgetsRemaining.TokensValue.soldOut`,
    defaultMessage: 'SOLD OUT',
  },
});

interface Props {
  tokenAmounts: PeriodTokensType;
  tokensBought: BigNumberish;
}

const displayedName = `dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokensValue`;

const RemainingTokensValue = ({ tokenAmounts, tokensBought }: Props) => {
  const { maxPeriodTokens, decimals } = tokenAmounts;

  const defineIfFiveFiguresOrLarger = useCallback(
    (value) => value.split('.')[0].length >= 5,
    [],
  );

  const boughtTokens = useMemo(
    () => getFormattedTokenValue(tokensBought, decimals),
    [tokensBought, decimals],
  );
  const availableTokens = useMemo(
    () => getFormattedTokenValue(maxPeriodTokens, decimals),
    [maxPeriodTokens, decimals],
  );

  const displayValue = useCallback(
    (tokens: string) => {
      const tokensDecimalValue = new Decimal(tokens);
      if (defineIfFiveFiguresOrLarger(tokens)) {
        return tokensDecimalValue.toDP(0).toString().split('.')[0];
      }

      return tokensDecimalValue.toDP(2).toString();
    },
    [defineIfFiveFiguresOrLarger],
  );

  if (bigNumberify(tokensBought).gte(maxPeriodTokens)) {
    return <FormattedMessage {...MSG.soldOut} />;
  }

  return (
    <>
      {/* @ts-ignore */}
      <FormattedNumber value={displayValue(boughtTokens)} /> /{' '}
      {/* @ts-ignore */}
      <FormattedNumber value={displayValue(availableTokens)} />
    </>
  );
};

RemainingTokensValue.displayName = displayedName;

export default RemainingTokensValue;
