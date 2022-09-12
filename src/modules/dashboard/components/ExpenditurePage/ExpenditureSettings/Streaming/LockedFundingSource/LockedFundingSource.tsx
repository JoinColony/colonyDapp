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

import { FundingSourceLocked } from '../types';

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
    defaultMessage: 'Limit',
  },
});

const displayName = 'dashboard.ExpenditurePage.Streaming.LockedFundingSource';

interface Props {
  fundingSource?: FundingSourceLocked;
  colony: Colony;
  index: number;
  multipleFundingSources?: boolean;
  isOpen?: boolean;
}

const LockedFundingSource = ({
  fundingSource,
  colony,
  index,
  multipleFundingSources,
  isOpen,
}: Props) => {
  const { formatMessage } = useIntl();
  const { rate, team, limit } = fundingSource || {};

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

  return (
    <>
      {isOpen && (
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
          {rate?.token && rate?.amount && (
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.row}>
                <InputLabel
                  label={formatMessage(MSG.rate, {
                    count: multipleFundingSources && `# ${index + 1}`,
                  })}
                  appearance={{
                    direction: 'horizontal',
                  }}
                />
                <div className={styles.valueAmount}>
                  <span className={styles.icon}>
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={rate.token}
                      name={rate.token.name || rate.token.address}
                    />
                  </span>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={rate.amount}
                  />
                  <span className={styles.symbol}>
                    {rate.token.symbol}/{rate.time}
                  </span>
                </div>
              </div>
            </FormSection>
          )}
          {limit && rate?.token && (
            <FormSection appearance={{ border: 'bottom' }}>
              <div className={styles.row}>
                <InputLabel
                  label={formatMessage(MSG.limit, {
                    count: multipleFundingSources && `# ${index + 1}`,
                  })}
                  appearance={{
                    direction: 'horizontal',
                  }}
                />
                <div className={styles.valueAmount}>
                  <span className={styles.icon}>
                    <TokenIcon
                      className={styles.tokenIcon}
                      token={rate.token}
                      name={rate.token.name || rate.token.address}
                    />
                  </span>
                  <Numeral
                    unit={getTokenDecimalsWithFallback(0)}
                    value={limit}
                  />
                  <span className={styles.symbol}>{rate.token.symbol}</span>
                </div>
              </div>
            </FormSection>
          )}
        </div>
      )}
    </>
  );
};

LockedFundingSource.displayName = displayName;

export default LockedFundingSource;
