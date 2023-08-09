import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useColonyTransfersQuery, Colony } from '~data/index';

import { MiniSpinnerLoader } from '~core/Preloaders';
import UnclaimedTransfersItem from './UnclaimedTransfersItem';
import { Tooltip } from '~core/Popover';

import styles from './UnclaimedTransfers.css';

const displayName = 'dashboard.UnclaimedTransfers';

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.UnclaimedTransfers.title',
    defaultMessage: 'Incoming funds for {colony}',
  },
  loadingData: {
    id: 'dashboard.UnclaimedTransfers.title',
    defaultMessage: 'Fetching incoming token transfers...',
  },
  timeLeftTooltip: {
    id: 'dashboard.UnclaimedTransfers.timeLeftTooltip',
    defaultMessage: 'Estimated time remaining: {timeLeft}',
  },
});

const UnclaimedTransfers = ({ colony, colony: { tokens } }: Props) => {
  const ESTIMATED_SECS_TO_FETCH_TOKEN_TRANSFERS = 20;
  const [secsLeft, updateSecsLeft] = useState(
    ESTIMATED_SECS_TO_FETCH_TOKEN_TRANSFERS * (tokens.length || 1),
  );

  const { data, error, loading } = useColonyTransfersQuery({
    variables: { address: colony.colonyAddress },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      updateSecsLeft(secsLeft - 1);
    }, 1000);
    if (secsLeft < 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [loading, secsLeft]);

  if (error) console.warn(error);

  if (loading) {
    return (
      <>
        <Tooltip
          content={
            <div className={styles.estimatedTimeTooltip}>
              <FormattedMessage
                {...MSG.timeLeftTooltip}
                values={{
                  timeLeft: `${String(Math.floor(secsLeft / 60)).padStart(
                    2,
                    '0',
                  )}:${String(secsLeft % 60).padStart(2, '0')}`,
                }}
              />
            </div>
          }
          trigger={secsLeft >= 0 ? 'hover' : null}
        >
          <div className={styles.loading}>
            <MiniSpinnerLoader
              className={styles.main}
              loadingText={MSG.loadingData}
            />
          </div>
        </Tooltip>
      </>
    );
  }

  return (
    <>
      {data && data.processedColony.unclaimedTransfers.length ? (
        <div className={styles.main}>
          <div className={styles.title}>
            <FormattedMessage
              {...MSG.title}
              values={{
                colony: colony.displayName || 'colony',
              }}
            />
          </div>
          <ul>
            {data.processedColony.unclaimedTransfers.map((transaction) => (
              <UnclaimedTransfersItem
                transaction={transaction}
                key={transaction.hash}
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
