import React, { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { bigNumberify, BigNumberish } from 'ethers/utils';
import { Textfit } from 'react-textfit';

import Numeral from '~core/Numeral';
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

  const boughtTokens = useMemo(
    () => getFormattedTokenValue(tokensBought, decimals),
    [tokensBought, decimals],
  );

  const totalTokens = useMemo(
    () => getFormattedTokenValue(maxPeriodTokens, decimals),
    [maxPeriodTokens, decimals],
  );

  const isMultiLine = useMemo(() => {
    const maxCharactersOnOneLine = 25;
    const combinedStringLength = totalTokens
      .split('.')[0]
      .concat(boughtTokens.split('.')[0]);

    return combinedStringLength.length > maxCharactersOnOneLine;
  }, [totalTokens, boughtTokens]);

  if (bigNumberify(tokensBought).gte(maxPeriodTokens)) {
    return <FormattedMessage {...MSG.soldOut} />;
  }

  return (
    <Textfit min={10} max={18} mode={isMultiLine ? 'multi' : 'single'}>
      <Numeral value={boughtTokens} /> / <Numeral value={totalTokens} />
    </Textfit>
  );
};

RemainingTokensValue.displayName = displayedName;

export default RemainingTokensValue;
