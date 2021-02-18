import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useColonyTransfersQuery, Colony } from '~data/index';

import { SpinnerLoader } from '~core/Preloaders';
import UnclaimedTransfersItem from './UnclaimedTransfersItem';

import styles from './UnclaimedTransfers.css';

const displayName = 'dashboard.UnclaimedTransfers';

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.UnclaimedTransfers.title',
    defaultMessage: 'Incoming funds',
  },
  loadingData: {
    id: 'dashboard.UnclaimedTransfers.title',
    defaultMessage: 'Loading token transfers...',
  },
});

const UnclaimedTransfers = ({ colony: { colonyAddress }, colony }: Props) => {
  const { data, error, loading } = useColonyTransfersQuery({
    variables: { address: colonyAddress },
  });
  if (error) console.warn(error);

  if (loading) {
    return (
      <div className={styles.main}>
        <SpinnerLoader appearance={{ size: 'small' }} />
        <span className={styles.loadingText}>
          <FormattedMessage {...MSG.loadingData} />
        </span>
      </div>
    );
  }

  return (
    <>
      {data && data.processedColony.unclaimedTransfers.length ? (
        <div className={styles.main}>
          <div className={styles.title}>
            <FormattedMessage {...MSG.title} />
          </div>
          <ul>
            {data.processedColony.unclaimedTransfers.map((transaction) => (
              <UnclaimedTransfersItem
                transaction={transaction}
                key={transaction.hash}
                colony={colony}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};

UnclaimedTransfers.displayName = displayName;

export default UnclaimedTransfers;
