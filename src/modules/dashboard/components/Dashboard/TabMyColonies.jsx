/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { SpinnerLoader } from '~core/Preloaders';
import ColonyGrid from '~dashboard/ColonyGrid';

import { currentUserSelector } from '../../../users/selectors';
import { userColoniesFetcher } from '../../fetchers';

import styles from './TabMyColonies.css';

const MSG = defineMessages({
  loadingColonyList: {
    id: 'dashboard.Dashboard.TabMyColonies.loadingColonyList',
    defaultMessage: 'Loading Colony List...',
  },
});

const TabMyColonies = () => {
  const currentUser = useSelector(currentUserSelector);
  const { data: colonyAddresses, isFetching } = useDataFetcher<Address[]>(
    userColoniesFetcher,
    [currentUser.profile.walletAddress],
    [
      currentUser.profile.walletAddress,
      currentUser.profile.metadataStoreAddress,
    ],
  );

  if (isFetching) return <SpinnerLoader />;

  return colonyAddresses ? (
    <ColonyGrid colonyAddresses={colonyAddresses} />
  ) : (
    <>
      <p className={styles.emptyText}>
        <FormattedMessage {...MSG.loadingColonyList} />
      </p>
    </>
  );
};

export default TabMyColonies;
