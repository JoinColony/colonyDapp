import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useColonyTransfersQuery, Colony } from '~data/index';

import Heading from '~core/Heading';
import { MiniSpinnerLoader } from '~core/Preloaders';
import Numeral from '~core/Numeral';
import InfoPopover from '~core/InfoPopover';

import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './ColonyUnclaimedTransfers.css';

const displayName = 'dashboard.ColonyUnclaimedTransfers';

interface Props {
  colony: Colony;
}

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyUnclaimedTransfers.title',
    defaultMessage: 'Incoming funds',
  },
  loadingData: {
    id: 'dashboard.ColonyUnclaimedTransfers.title',
    defaultMessage: 'Loading token transfers...',
  },
});

const ColonyUnclaimedTransfers = ({ colony }: Props) => {
  const { data, error, loading } = useColonyTransfersQuery({
    variables: { address: colony.colonyAddress },
  });
  if (error) console.warn(error);
  console.log(
    '🚀 ~ file: ColonyUnclaimedTransfers.tsx ~ line 37 ~ ColonyUnclaimedTransfers ~ data',
    data,
  );

  if (loading) {
    return (
      <MiniSpinnerLoader
        className={styles.main}
        loadingText={MSG.loadingData}
      />
    );
  }

  const firstItem = data?.processedColony.unclaimedTransfers[1];
  console.log(
    '🚀 ~ file: ColonyUnclaimedTransfers.tsx ~ line 50 ~ ColonyUnclaimedTransfers ~ firstItem',
    firstItem,
  );

  return (
    <>
      {data && data.processedColony.unclaimedTransfers.length && (
        <div className={styles.main}>
          <Heading appearance={{ size: 'normal', weight: 'bold' }}>
            <FormattedMessage {...MSG.title} />
          </Heading>
          {data && (
            <ul>
              <li>1st item</li>
              {/* {data.tokens.map((token) => (
                <li key={token.address}>
                  <div className={styles.tokenItem}>
                    <span className={styles.tokenValue}>
                      <Numeral
                        unit={getTokenDecimalsWithFallback(decimals)}
                        value={balance}
                      />
                    </span>
                    <span className={styles.tokenSymbol}>
                      <span>{symbol}</span>
                    </span>
                  </div>
                </li>
              ))} */}
              <li>+5 more</li>
            </ul>
          )}
        </div>
      )}
    </>
  );
};

ColonyUnclaimedTransfers.displayName = displayName;

export default ColonyUnclaimedTransfers;
