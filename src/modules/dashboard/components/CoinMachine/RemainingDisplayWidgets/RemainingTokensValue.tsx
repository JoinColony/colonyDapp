import { FormattedMessage, defineMessages } from 'react-intl';
import React from 'react';
import { bigNumberify, BigNumberish } from 'ethers/utils';

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

  if (bigNumberify(tokensBought).gte(maxPeriodTokens)) {
    return <FormattedMessage {...MSG.soldOut} />;
  }

  return (
    <>
      {getFormattedTokenValue(tokensBought, decimals)} /{' '}
      {getFormattedTokenValue(maxPeriodTokens, decimals)}
    </>
  );
};

RemainingTokensValue.displayName = displayedName;

export default RemainingTokensValue;
