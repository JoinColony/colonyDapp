import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import React, { useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import ColorTag, { Color } from '~core/ColorTag';
import { FormSection } from '~core/Fields';
import { FundingSource as FundingSourceType } from '~dashboard/ExpenditurePage/Streaming/types';
import { Colony } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import Numeral from '~core/Numeral';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './FundingSource.css';

const displayName = 'dashboard.StartStreamDialog.FundingSource';

const MSG = defineMessages({
  team: {
    id: 'dashboard.StartStreamDialog.FundingSource.team',
    defaultMessage: 'Team',
  },
  rate: {
    id: 'dashboard.StartStreamDialog.FundingSource.rate',
    defaultMessage: 'Rate {count}',
  },
  rateValue: {
    id: 'dashboard.StartStreamDialog.FundingSource.rateValue',
    defaultMessage: '{tokenIcon} {tokenAmount} {token} / {time}',
  },
  limit: {
    id: 'dashboard.StartStreamDialog.FundingSource.limit',
    defaultMessage: 'Limit {count}',
  },
  limitValue: {
    id: 'dashboard.StartStreamDialog.FundingSource.limitValue',
    defaultMessage: '{tokenIcon} {tokenAmount} {token}',
  },
});

interface Props {
  fundingSource: FundingSourceType;
  colony: Colony;
}

const FundingSource = ({ fundingSource, colony }: Props) => {
  const { team, rate } = fundingSource;

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
    <div className={styles.wrapper}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.row}>
          <span className={styles.label}>
            <FormattedMessage {...MSG.team} />
          </span>
          <div className={classNames(styles.value, styles.centered)}>
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
      {rate.map((rateItem, index) => {
        const tokenData = colony.tokens.find(
          (colonyToken) => colonyToken.id === rateItem.token,
        );

        return (
          <FormSection appearance={{ border: 'bottom' }} key={rateItem.id}>
            <div className={styles.row}>
              <div className={styles.label}>
                <FormattedMessage
                  {...MSG.rate}
                  values={{ count: rate.length > 1 && `#${index + 1}` }}
                />
              </div>
              <div className={classNames(styles.value, styles.centered)}>
                <FormattedMessage
                  {...MSG.rateValue}
                  values={{
                    tokenIcon: tokenData && (
                      <span className={styles.icon}>
                        <TokenIcon
                          className={styles.tokenIcon}
                          token={tokenData}
                          name={tokenData.name || tokenData.address}
                        />
                      </span>
                    ),
                    tokenAmount: (
                      <span>
                        <Numeral
                          unit={getTokenDecimalsWithFallback(0)}
                          value={rateItem.amount || 0}
                        />
                      </span>
                    ),
                    token: tokenData?.symbol,
                    time: rateItem.time,
                  }}
                />
              </div>
            </div>
          </FormSection>
        );
      })}
      {rate.map((rateItem, index) => {
        const tokenData = colony.tokens.find(
          (colonyToken) => colonyToken.id === rateItem.token,
        );

        return (
          <FormSection appearance={{ border: 'bottom' }} key={rateItem.id}>
            <div className={styles.row}>
              <div className={styles.label}>
                <FormattedMessage
                  {...MSG.limit}
                  values={{ count: rate.length > 1 && `#${index + 1}` }}
                />
              </div>
              <div className={classNames(styles.value, styles.centered)}>
                <FormattedMessage
                  {...MSG.limitValue}
                  values={{
                    tokenIcon: tokenData && (
                      <span className={styles.icon}>
                        <TokenIcon
                          className={styles.tokenIcon}
                          token={tokenData}
                          name={tokenData.name || tokenData.address}
                        />
                      </span>
                    ),
                    tokenAmount: (
                      <Numeral
                        unit={getTokenDecimalsWithFallback(0)}
                        value={rateItem.limit || 0}
                      />
                    ),
                    token: tokenData?.symbol,
                  }}
                />
              </div>
            </div>
          </FormSection>
        );
      })}
    </div>
  );
};

FundingSource.displayName = displayName;

export default FundingSource;
