import React, { useEffect, useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useDispatch } from 'redux-react-hook';
import classnames from 'classnames';
import { BigNumber } from 'ethers/utils';

import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';

import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
import { getMainClasses } from '~utils/css';
import { TimerValue } from '~utils/components';
import useSplitTime from '~utils/hooks/useSplitTime';
import { getFormattedTokenValue } from '~utils/tokens';

import TokenPriceStatusIcon, {
  TokenPriceStatuses,
} from '../TokenPriceStatusIcon/TokenPriceStatusIcon';

import styles from './RemainingDisplayWidget.css';

export enum DataDisplayType {
  Time = 'Time',
  Tokens = ' Tokens',
}

type Appearance = {
  theme?: 'white' | 'danger';
};

type Props = {
  colonyAddress?: Address;
  displayType: DataDisplayType;
  value?: string | number | null;
  appearance?: Appearance;
  periodLength?: number;
  periodTokens?: {
    decimals: number;
    soldPeriodTokens: BigNumber;
    maxPeriodTokens: BigNumber;
    targetPeriodTokens: BigNumber;
  };
};

const displayName = 'dashboard.CoinMachine.RemainingDisplayWidget';

const MSG = defineMessages({
  timeRemainingTitle: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.timeRemainingTitle',
    defaultMessage: 'Time remaining',
  },
  timeRemainingTooltip: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.timeRemainingTooltip',
    defaultMessage: `This is the amount of time remaining in the sale. Whatever the time says, that’s how much time remains. When it reaches zero, there will be no more time remaining. That’s how time works. When no more time remains, the next sale will start, and the amount of time remaining for that sale will appear in this box.`,
  },
  tokensRemainingTitle: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.tokensRemainingTitle',
    defaultMessage: 'Tokens remaining',
  },
  tokensRemainingTooltip: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.tokensRemainingTooltip',
    defaultMessage: `This is the number of tokens remaining in the current batch.`,
  },
  tokensTypePlaceholder: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.tokensRemainingTitle',
    defaultMessage: '0',
  },
  timeTypePlaceholder: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.timeTypePlaceholder',
    defaultMessage: `N/A`,
  },
  tokensTypeFooterText: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.tokensTypeFooterText',
    defaultMessage: 'Price next sale',
  },
  comeBackTitle: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.comeBackTitle',
    defaultMessage: 'Come back in...',
  },
  soldOut: {
    id: 'dashboard.CoinMachine.RemainingDisplayWidget.tokensTypeFooterText',
    defaultMessage: 'SOLD OUT',
  },
});

const RemainingDisplayWidget = ({
  displayType,
  appearance = { theme: 'white' },
  value,
  periodLength,
  periodTokens,
  colonyAddress,
}: Props) => {
  const dispatch = useDispatch();

  const displaysTimer = displayType === DataDisplayType.Time;
  const { splitTime, timeLeft } = useSplitTime(
    displaysTimer && typeof value === 'number' ? value : 0,
    displaysTimer,
    periodLength,
  );

  const widgetText = useMemo(() => {
    if (displayType === DataDisplayType.Time) {
      return {
        title:
          appearance.theme === 'danger'
            ? MSG.comeBackTitle
            : MSG.timeRemainingTitle,
        placeholder: MSG.timeTypePlaceholder,
        tooltipText: MSG.timeRemainingTooltip,
      };
    }

    return {
      title: MSG.tokensRemainingTitle,
      placeholder: MSG.tokensTypePlaceholder,
      tooltipText: MSG.tokensRemainingTooltip,
      footerText: MSG.tokensTypeFooterText,
    };
  }, [displayType, appearance]);

  const displayedValue = useMemo(() => {
    if (displayType === DataDisplayType.Time && splitTime) {
      return <TimerValue splitTime={splitTime} />;
    }
    if (periodTokens && displayType === DataDisplayType.Tokens) {
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
  }, [displayType, splitTime, widgetText, periodTokens]);

  const priceStatus = useMemo(() => {
    if (!periodTokens || displayType === DataDisplayType.Time) {
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
  }, [displayType, periodTokens]);

  const showValueWarning =
    displayType === DataDisplayType.Time &&
    appearance.theme !== 'danger' &&
    typeof value === 'number' &&
    periodLength &&
    (timeLeft * 100) / periodLength <= 10;

  const isValueWarning = useMemo(() => {
    if (periodTokens?.soldPeriodTokens.gte(periodTokens?.maxPeriodTokens)) {
      return true;
    }

    return false;
  }, [periodTokens]);

  useEffect(() => {
    if (timeLeft === 0 && colonyAddress !== undefined) {
      dispatch({
        type: ActionTypes.COIN_MACHINE_PERIOD_UPDATE,
        payload: { colonyAddress },
      });
    }
  }, [timeLeft, colonyAddress, dispatch]);

  return (
    <div className={getMainClasses(appearance, styles)}>
      <div className={styles.header}>
        <Heading
          text={widgetText.title}
          appearance={{
            size: 'small',
            theme: appearance.theme === 'danger' ? 'invert' : 'dark',
          }}
        />
        <QuestionMarkTooltip
          className={styles.tooltipIcon}
          tooltipText={widgetText.tooltipText}
          invertedIcon={appearance.theme === 'danger'}
          tooltipClassName={styles.tooltip}
        />
      </div>
      <p
        className={classnames(styles.value, {
          [styles.valueWarning]: isValueWarning || showValueWarning,
        })}
      >
        {displayedValue}
      </p>
      {periodTokens && widgetText.footerText && (
        <div className={styles.footer}>
          <p className={styles.footerText}>
            <FormattedMessage {...widgetText.footerText} />
          </p>
          {priceStatus && <TokenPriceStatusIcon status={priceStatus} />}
        </div>
      )}
    </div>
  );
};

RemainingDisplayWidget.displayName = displayName;

export default RemainingDisplayWidget;
