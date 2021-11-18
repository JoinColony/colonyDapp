import { FormattedMessage, defineMessages } from 'react-intl';
import React from 'react';
import { bigNumberify, BigNumberish } from 'ethers/utils';

import { PeriodTokensType } from '~dashboard/CoinMachine/RemainingDisplayWidgets';
import { getFormattedTokenValue } from '~utils/tokens';

const MSG = defineMessages({
  soldOut: {
    id: `dashboard.CoinMachine.TokenSalesTable.SoldTokensWidget.soldOut`,
    defaultMessage: 'SOLD OUT',
  },
});

interface Props {
  periodTokens: PeriodTokensType;
  tokensBought: BigNumberish;
  tokensAvailable: BigNumberish;
}

const displayedName = `dashboard.CoinMachine.TokenSalesTable.SoldTokensWidget`;

const SoldTokensWidget = ({
  periodTokens,
  tokensBought,
  tokensAvailable = 0,
}: Props) => {
  const { maxPeriodTokens, decimals } = periodTokens;

  const upperLimit = bigNumberify(tokensAvailable).lte(maxPeriodTokens)
    ? bigNumberify(tokensAvailable)
    : maxPeriodTokens;

  if (bigNumberify(tokensBought).gte(upperLimit) && upperLimit.gt(0)) {
    return <FormattedMessage {...MSG.soldOut} />;
  }

  return (
    <>
      {getFormattedTokenValue(bigNumberify(tokensBought), decimals)}/
      {getFormattedTokenValue(upperLimit, decimals)}
    </>
  );
};

SoldTokensWidget.displayName = displayedName;

export default SoldTokensWidget;
