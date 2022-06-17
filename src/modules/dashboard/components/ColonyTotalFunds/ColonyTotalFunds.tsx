import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useMediaQuery } from 'react-responsive';
import { ColonyVersion } from '@colony/colony-js';

import { Colony, useLoggedInUser } from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import styles from './ColonyTotalFunds.css';
import { query700 as query } from '~styles/queries.css';
import ColonyTotalFundsSelectedToken from './ColonyTotalFundsSelectedToken';
import ColonyTotalFundsManageFunds from './ColonyTotalFundsManageFunds';

const MSG = defineMessages({
  totalBalance: {
    id: 'dashboard.ColonyTotalFunds.totalBalance',
    defaultMessage: 'Colony total balance',
  },
});

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyTotalFunds';

const ColonyTotalFunds = ({ colony: { version }, colony }: Props) => {
  const { networkId } = useLoggedInUser();

  const isMobile = useMediaQuery({ query });

  const isSupportedColonyVersion =
    parseInt(version, 10) >= ColonyVersion.LightweightSpaceship;
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  return (
    <div className={styles.main}>
      {isMobile ? (
        <>
          <ColonyTotalFundsSelectedToken colony={colony}>
            <div className={styles.totalBalanceCopy}>
              <FormattedMessage {...MSG.totalBalance} />
            </div>
          </ColonyTotalFundsSelectedToken>
          {isSupportedColonyVersion && isNetworkAllowed && (
            <ColonyTotalFundsManageFunds colony={colony} />
          )}
        </>
      ) : (
        <>
          <ColonyTotalFundsSelectedToken colony={colony} />
          <div className={styles.totalBalanceCopy}>
            <FormattedMessage {...MSG.totalBalance} />
            {isSupportedColonyVersion && isNetworkAllowed && (
              <ColonyTotalFundsManageFunds colony={colony} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

ColonyTotalFunds.displayName = displayName;

export default ColonyTotalFunds;
