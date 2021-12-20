import React, { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers/utils';

import RemainingTokensValue from './RemainingTokensValue';
import RemainingWidget from './RemainingDisplayWidget';

interface Appearance {
  theme?: 'white' | 'danger';
}

export interface PeriodTokensType {
  decimals: number;
  soldPeriodTokens: BigNumber;
  maxPeriodTokens: BigNumber;
  targetPeriodTokens?: BigNumber;
}

interface Props {
  isTotalSale: boolean;
  appearance?: Appearance;
  tokenAmounts?: PeriodTokensType;
}

const displayName =
  'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens';

const MSG = defineMessages({
  tokensRemainingTitle: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.title',
    defaultMessage: `{isTotalSale, select,
      true {Total}
      false {Batch}
    } sold vs available`,
  },
  tokensRemainingTooltip: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.tooltip',
    // eslint-disable-next-line max-len
    defaultMessage: `This is the number of tokens remaining in the {isTotalSale, select,
      true {sale.}
      false {current batch.}}`,
  },
  tokensTypePlaceholder: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.title',
    defaultMessage: '0',
  },
});

const RemainingTokens = ({
  isTotalSale,
  appearance = { theme: 'white' },
  tokenAmounts,
}: Props) => {
  const widgetText = useMemo(() => {
    return {
      title: MSG.tokensRemainingTitle,
      placeholder: MSG.tokensTypePlaceholder,
      tooltipText: MSG.tokensRemainingTooltip,
    };
  }, []);

  const displayedValue = useMemo(() => {
    if (tokenAmounts) {
      return <RemainingTokensValue tokenAmounts={tokenAmounts} />;
    }

    return <FormattedMessage {...widgetText.placeholder} />;
  }, [widgetText, tokenAmounts]);

  const showValueWarning = useMemo(() => {
    if (
      tokenAmounts?.soldPeriodTokens.gt(
        tokenAmounts?.maxPeriodTokens.mul(90).div(100),
      )
    ) {
      return true;
    }

    return false;
  }, [tokenAmounts]);

  return (
    <RemainingWidget
      widgetText={widgetText}
      appearance={appearance}
      isWarning={showValueWarning}
      displayedValue={displayedValue}
      isTotalSale={isTotalSale}
    />
  );
};

RemainingTokens.displayName = displayName;

export default RemainingTokens;
