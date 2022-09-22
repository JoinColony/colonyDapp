import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import ColorTag, { Color } from '~core/ColorTag';
import { InputLabel } from '~core/Fields';
import { Colony } from '~data/index';

import styles from './CancelStreamingDialog.css';

const MSG = defineMessages({
  fundingSource: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.fundingSource`,
    defaultMessage: 'Funding Source',
  },
  team: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.team`,
    defaultMessage: 'Team',
  },
  rate: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.rate`,
    defaultMessage: 'Rate',
  },
  limit: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.limit`,
    defaultMessage: 'Limit',
  },
});

interface Props {
  colony: Colony;
  limit: string;
  rate: string;
  filteredDomainId: number;
  index: number;
}

const displayName = 'dashboard.CancelStreamingDialog.FundingSourceItem';

const FundingSourceItem = ({
  colony,
  limit,
  rate,
  filteredDomainId,
  index,
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

  return (
    <>
      <h4 className={styles.dialogSectionTitle}>
        <FormattedMessage
          {...MSG.fundingSource}
          defaultMessage={`${index + 1}: ${MSG.fundingSource.defaultMessage}`}
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
        <span className={styles.value}>{rate}</span>
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
        <span className={styles.value}>{limit}</span>
      </div>
    </>
  );
};

FundingSourceItem.displayName = displayName;

export default FundingSourceItem;
