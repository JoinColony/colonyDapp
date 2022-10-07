import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import ColorTag, { Color } from '~core/ColorTag';
import { InputLabel } from '~core/Fields';
import Numeral from '~core/Numeral';
import { AnyToken, Colony } from '~data/index';
import TokenIcon from '~dashboard/HookedTokenIcon';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './CancelStreamingDialog.css';

const MSG = defineMessages({
  fundingSource: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.fundingSource`,
    defaultMessage: '{number}Funding Source',
  },
  team: {
    id: `dashboard.CancelStreamingDialog.FundingSourceItem.team`,
    defaultMessage: 'Team',
  },
  rate: {
    id: `dashboard.CancelStreamingDialog.FundingSourceItem.rate`,
    defaultMessage: 'Rate',
  },
  limit: {
    id: `dashboard.CancelStreamingDialog.FundingSourceItem.limit`,
    defaultMessage: 'Limit',
  },
});

interface Props {
  colony: Colony;
  filteredDomainId: string;
  index: number;
  isMultiple?: boolean;
  rateTime: string;
  rateAmount: number;
  rateToken: AnyToken;
}

const displayName = 'dashboard.CancelStreamingDialog.FundingSourceItem';

const FundingSourceItem = ({
  colony,
  rateToken,
  rateAmount,
  rateTime,
  filteredDomainId,
  index,
  isMultiple,
}: Props) => {
  const domain = useMemo(
    () =>
      colony?.domains.find(
        ({ ethDomainId }) => Number(filteredDomainId) === ethDomainId,
      ),
    [colony, filteredDomainId],
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

  const fundingSourceOrder = isMultiple ? `${index + 1}. ` : '';

  return (
    <>
      <h4 className={styles.dialogSectionTitle}>
        <FormattedMessage
          {...MSG.fundingSource}
          values={{ number: fundingSourceOrder }}
        />
      </h4>
      <div
        className={classNames(styles.row, styles.rowAlt, styles.userContainer)}
      >
        <InputLabel
          label={MSG.team}
          appearance={{
            direction: 'horizontal',
          }}
        />
        <div className={styles.activeItem}>
          <ColorTag color={getDomainColor(filteredDomainId)} />
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
      <div
        className={classNames(styles.row, styles.rowAlt, styles.userContainer)}
      >
        <InputLabel
          label={MSG.rate}
          appearance={{
            direction: 'horizontal',
          }}
        />
        <div className={styles.valueAmount}>
          <span className={styles.icon}>
            <TokenIcon
              className={styles.tokenIcon}
              token={rateToken}
              name={rateToken.name || rateToken.address}
            />
          </span>
          <Numeral unit={getTokenDecimalsWithFallback(0)} value={rateAmount} />
          <span className={styles.symbol}>
            {rateToken.symbol}/{rateTime}
          </span>
        </div>
      </div>
      <div
        className={classNames(styles.row, styles.rowAlt, styles.userContainer)}
      >
        <InputLabel
          label={MSG.limit}
          appearance={{
            direction: 'horizontal',
          }}
        />
        <div className={styles.valueAmount}>
          <span className={styles.icon}>
            <TokenIcon
              className={styles.tokenIcon}
              token={rateToken}
              name={rateToken.name || rateToken.address}
            />
          </span>
          <Numeral unit={getTokenDecimalsWithFallback(0)} value={rateAmount} />
          <span className={styles.symbol}>{rateToken.symbol}</span>
        </div>
      </div>
    </>
  );
};

FundingSourceItem.displayName = displayName;

export default FundingSourceItem;
