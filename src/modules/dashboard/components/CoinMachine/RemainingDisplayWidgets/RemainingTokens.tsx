import React, { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { BigNumber } from 'ethers/utils';

import { getFormattedTokenValue } from '~utils/tokens';

import { TokenPriceStatuses } from '../TokenPriceStatusIcon/TokenPriceStatusIcon';

import RemainingWidget from './RemainingDisplayWidget';

export enum DataDisplayType {
  Time = 'Time',
  Tokens = ' Tokens',
}

type Appearance = {
  theme?: 'white' | 'danger';
};

type Props = {
  appearance?: Appearance;
  periodTokens?: {
    decimals: number;
    soldPeriodTokens: BigNumber;
    maxPeriodTokens: BigNumber;
    targetPeriodTokens: BigNumber;
  };
};

const displayName =
  'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens';

const MSG = defineMessages({
  tokensRemainingTitle: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.title',
    defaultMessage: 'Tokens remaining',
  },
  tokensRemainingTooltip: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.tooltip',
    defaultMessage: `This is the number of tokens remaining in the current batch.`,
  },
  tokensTypePlaceholder: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.title',
    defaultMessage: '0',
  },
  tokensTypeFooterText: {
    id: `dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.footerText`,
    defaultMessage: 'Price next sale',
  },
  soldOut: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidgets.RemainingTokens.soldOut',
    defaultMessage: 'SOLD OUT',
  },
});

const RemainingTokens = ({
  appearance = { theme: 'white' },
  periodTokens,
}: Props) => {
  const widgetText = useMemo(() => {
    return {
      title: MSG.tokensRemainingTitle,
      placeholder: MSG.tokensTypePlaceholder,
      tooltipText: MSG.tokensRemainingTooltip,
      footerText: MSG.tokensTypeFooterText,
    };
  }, []);

  const displayedValue = useMemo(() => {
    if (periodTokens) {
      const { soldPeriodTokens, decimals, maxPeriodTokens } = periodTokens;

      if (soldPeriodTokens.gte(maxPeriodTokens)) {
        return <FormattedMessage {...MSG.soldOut} />;
      }

      return `${getFormattedTokenValue(
        maxPeriodTokens.sub(soldPeriodTokens),
        decimals,
      )}/${getFormattedTokenValue(maxPeriodTokens, decimals)}`;
    }

    return <FormattedMessage {...widgetText.placeholder} />;
  }, [widgetText, periodTokens]);

  const priceStatus = useMemo(() => {
    if (!periodTokens) {
      return undefined;
    }

    const {
      soldPeriodTokens,
      maxPeriodTokens,
      targetPeriodTokens,
    } = periodTokens;

    if (soldPeriodTokens.gte(maxPeriodTokens)) {
      return TokenPriceStatuses.PRICE_SOLD_OUT;
    }

    if (soldPeriodTokens.eq(targetPeriodTokens)) {
      return TokenPriceStatuses.PRICE_NO_CHANGES;
    }

    if (soldPeriodTokens.lt(targetPeriodTokens)) {
      return TokenPriceStatuses.PRICE_DOWN;
    }

    if (soldPeriodTokens.gt(targetPeriodTokens)) {
      return TokenPriceStatuses.PRICE_UP;
    }

    return undefined;
  }, [periodTokens]);

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
      priceStatus={periodTokens && priceStatus}
    />
  );
};

RemainingTokens.displayName = displayName;

export default RemainingTokens;
