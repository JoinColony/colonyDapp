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
  targetPeriodTokens: BigNumber;
}

interface Props {
  isTotalSale: boolean;
  appearance?: Appearance;
  periodTokens?: PeriodTokensType;
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
  soldOut: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.soldOut',
    defaultMessage: 'SOLD OUT',
  },
});

const RemainingTokens = ({
  isTotalSale,
  appearance = { theme: 'white' },
  periodTokens,
}: Props) => {
  const widgetText = useMemo(() => {
    return {
      title: MSG.tokensRemainingTitle,
      placeholder: MSG.tokensTypePlaceholder,
      tooltipText: MSG.tokensRemainingTooltip,
    };
  }, []);

  const displayedValue = useMemo(() => {
    if (periodTokens) {
      return (
        <RemainingTokensValue
          periodTokens={periodTokens}
          tokensBought={periodTokens.soldPeriodTokens}
        />
      );
    }

    return <FormattedMessage {...widgetText.placeholder} />;
  }, [widgetText, periodTokens]);

  const showValueWarning = useMemo(() => {
    if (periodTokens?.soldPeriodTokens.gte(periodTokens?.maxPeriodTokens)) {
      return true;
    }

    return false;
  }, [periodTokens]);

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
