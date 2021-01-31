import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useColonyTransfersQuery, Colony } from '~data/index';
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
});

const UnclaimedTransfers = ({ colony: { colonyAddress }, colony }: Props) => {
  const { data, error } = useColonyTransfersQuery({
    variables: { address: colonyAddress },
  });
  if (error) console.warn(error);

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
