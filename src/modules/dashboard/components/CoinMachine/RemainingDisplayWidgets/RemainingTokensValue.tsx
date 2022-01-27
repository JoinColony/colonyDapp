import React, { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Textfit } from 'react-textfit';

import Numeral from '~core/Numeral';
import { PeriodTokensType } from '~dashboard/CoinMachine/RemainingDisplayWidgets';
import { getStdFormattedTokenValue } from '~utils/tokens';

const MSG = defineMessages({
  soldOut: {
    id: `dashboard.CoinMachine.RemainingDisplayWidgetsRemaining.TokensValue.soldOut`,
    defaultMessage: 'SOLD OUT',
  },
});

interface Props {
  tokenAmounts: PeriodTokensType;
}

const displayedName = `dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokensValue`;

const RemainingTokensValue = ({ tokenAmounts }: Props) => {
  const { maxPeriodTokens, decimals, soldPeriodTokens } = tokenAmounts;

  const boughtTokens = useMemo(
    () => getStdFormattedTokenValue(soldPeriodTokens, decimals),
    [soldPeriodTokens, decimals],
  );

  const totalTokens = useMemo(
    () => getStdFormattedTokenValue(maxPeriodTokens, decimals),
    [maxPeriodTokens, decimals],
  );

  const isMultiLine = useMemo(() => {
    const maxCharactersOnOneLine = 25;
    const combinedStringLength = totalTokens
      .split('.')[0]
      .concat(boughtTokens.split('.')[0]);

    return combinedStringLength.length > maxCharactersOnOneLine;
  }, [totalTokens, boughtTokens]);

  if (soldPeriodTokens.gte(maxPeriodTokens)) {
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
