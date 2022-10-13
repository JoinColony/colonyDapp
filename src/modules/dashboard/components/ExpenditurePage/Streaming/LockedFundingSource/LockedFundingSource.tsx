import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import ColorTag, { Color } from '~core/ColorTag';
import { FormSection, InputLabel } from '~core/Fields';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { Colony } from '~data/index';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { FundingSource } from '../types';

import styles from './LockedFundingSource.css';

const MSG = defineMessages({
  team: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedFundingSource.team',
    defaultMessage: 'Team',
  },
  rate: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedFundingSource.rate',
    defaultMessage: 'Rate {count}',
  },
  limit: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedFundingSource.limit',
    defaultMessage: 'Limit {count}',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.LockedFundingSource';

interface Props {
  fundingSource?: FundingSource;
  colony: Colony;
  isOpen?: boolean;
  hasRateError?: boolean;
  hasLimitError?: boolean;
}

const LockedFundingSource = ({
  fundingSource,
  colony,
  isOpen,
  hasRateError,
  hasLimitError,
}: Props) => {
  const { formatMessage } = useIntl();
  const { rates, team } = fundingSource || {};

  const domain = useMemo(
    () =>
      colony?.domains.find(({ ethDomainId }) => Number(team) === ethDomainId),
    [colony, team],
  );

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const rootDomainColor: Color = Color.LightPink;
      const defaultColor: Color = Color.Yellow;
      if (domainId === String(ROOT_DOMAIN_ID)) {
        return rootDomainColor;
      }
      if (!colony || !domainId) {
        return defaultColor;
      }
      return domain ? domain.color : defaultColor;
    },
    [colony, domain],
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.formContainer}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <InputLabel
            label={MSG.team}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <div className={styles.activeItem}>
            <ColorTag color={getDomainColor(team)} />
            <div
              className={classNames(
                styles.activeItemLabel,
                styles.lockedActiveItemLabel,
              )}
            >
              {domain?.name}
            </div>
          </div>
        </div>
      </FormSection>
      {rates?.map(({ amount, token, time, id }, rateIndex) => {
        const tokenData = colony.tokens?.find(
          (tokenItem) => token && tokenItem.address === token,
        );
        return (
          tokenData &&
          amount && (
            <FormSection appearance={{ border: 'bottom' }} key={id}>
              <div className={styles.row}>
                <InputLabel
                  label={formatMessage(MSG.rate, {
                    count: rates.length > 1 && `#${rateIndex + 1}`,
                  })}
                  appearance={{
                    direction: 'horizontal',
                  }}
                />
                <div
                  className={classNames(styles.valueAmount, {
                    [styles.error]: hasRateError,
                  })}
                >
                  <span className={styles.icon}>
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={tokenData}
                      name={tokenData.name || tokenData.address}
                    />
                  </span>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={amount}
                  />
                  <span className={styles.symbol}>
                    {tokenData.symbol}/{time}
                  </span>
                </div>
              </div>
            </FormSection>
          )
        );
      })}
      {rates?.map(({ token, limit, id }, rateIndex) => {
        const tokenData = colony.tokens?.find(
          (tokenItem) => token && tokenItem.address === token,
        );

        return (
          tokenData &&
          limit && (
            <FormSection appearance={{ border: 'bottom' }} key={id}>
              <div className={styles.row}>
                <InputLabel
                  label={formatMessage(MSG.limit, {
                    count: rates.length > 1 && `#${rateIndex + 1}`,
                  })}
                  appearance={{
                    direction: 'horizontal',
                  }}
                />
                <div
                  className={classNames(styles.valueAmount, {
                    [styles.error]: hasLimitError,
                  })}
                >
                  <span className={styles.icon}>
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={tokenData}
                      name={tokenData.name || tokenData.address}
                    />
                  </span>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={limit}
                  />
                  <span className={styles.symbol}>{tokenData.symbol}</span>
                </div>
              </div>
            </FormSection>
          )
        );
      })}
    </div>
  );
};

LockedFundingSource.displayName = displayName;

export default LockedFundingSource;
