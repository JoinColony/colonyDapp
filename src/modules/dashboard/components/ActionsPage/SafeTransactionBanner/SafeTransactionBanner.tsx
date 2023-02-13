import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Alert from '~core/Alert';
import ExternalLink from '~core/ExternalLink';
import Icon from '~core/Icon';
import { getSafeTransactionMonitor } from '~externalUrls';

import styles from './SafeTransactionBanner.css';

interface Props {
  chainId: string;
  transactionHash: string;
}

const MSG = defineMessages({
  processTransaction: {
    id: `dashboard.ActionsPage.SafeTransactionBanner.processTransaction`,
    defaultMessage: `Click ‘Process transaction’, then click ‘Execute’ to pay the gas costs and complete the transaction.`,
  },
  monitorUrl: {
    id: `dashboard.ActionsPage.SafeTransactionBanner.monitorUrl`,
    defaultMessage: `Process transaction`,
  },
});

const displayName = 'dashboard.ActionsPage.SafeTransactionBanner';

const SafeTransactionBanner = ({ chainId, transactionHash }: Props) => {
  const transactionMonitorUrl = getSafeTransactionMonitor(
    chainId,
    transactionHash,
  );
  return (
    <div className={styles.safeTransactionBannerContainer}>
      <Alert
        appearance={{
          theme: 'pinky',
          margin: 'none',
          borderRadius: 'none',
        }}
      >
        <div className={styles.safeTransactionBanner}>
          <FormattedMessage {...MSG.processTransaction} />
          <ExternalLink
            href={transactionMonitorUrl}
            className={styles.monitorUrl}
          >
            <FormattedMessage {...MSG.monitorUrl} />
            <Icon name="share" />
          </ExternalLink>
        </div>
      </Alert>
    </div>
  );
};

SafeTransactionBanner.displayName = displayName;

export default SafeTransactionBanner;
