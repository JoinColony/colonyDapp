import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from '../DetailsWidget.css';

const displayName = 'DetailsWidget.DetailsWidgetAddSafe';
const MSG = defineMessages({
  chain: {
    id: 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetAddSafe.chain',
    defaultMessage: 'Chain',
  },
  safeAddress: {
    id: 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetAddSafe.safeAddress',
    defaultMessage: 'Safe Address',
  },
  safeName: {
    id: 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetAddSafe.safeName',
    defaultMessage: 'Safe Name',
  },
  moduleAddress: {
    id:
      'dashboard.ActionsPage.DetailsWidget.DetailsWidgetAddSafe.moduleAddress',
    defaultMessage: 'Module Address',
  },
});

export interface AddedSafe {
  address?: JSX.Element | null;
  chainName?: string | null;
  safeName?: string | null;
  moduleAddress?: JSX.Element | null;
}

interface Props {
  addedSafe: AddedSafe;
}

const DetailsWidgetAddSafe = ({
  addedSafe: { address, chainName, safeName, moduleAddress },
}: Props) => {
  return (
    <>
      {chainName && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.chain} />
          </div>
          <div className={styles.value}>
            <span>{chainName}</span>
          </div>
        </div>
      )}
      {address && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.safeAddress} />
          </div>
          <div className={styles.value}>
            <span>{address}</span>
          </div>
        </div>
      )}
      {safeName && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.safeName} />
          </div>
          <div className={styles.value}>
            <span>{safeName}</span>
          </div>
        </div>
      )}
      {moduleAddress && (
        <div className={styles.item}>
          <div className={styles.label}>
            <FormattedMessage {...MSG.moduleAddress} />
          </div>
          <div className={styles.value}>
            <span>{moduleAddress}</span>
          </div>
        </div>
      )}
    </>
  );
};

DetailsWidgetAddSafe.displayName = displayName;

export default DetailsWidgetAddSafe;
