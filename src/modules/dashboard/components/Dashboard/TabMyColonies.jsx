/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { SpinnerLoader, DotsLoader } from '~core/Preloaders';
import ColonyGrid from '~dashboard/ColonyGrid';

import { currentUserSelector } from '../../../users/selectors';
import { userColoniesFetcher } from '../../fetchers';

import styles from './TabMyColonies.css';

const MSG = defineMessages({
  loadingColonyList: {
    id: 'dashboard.Dashboard.TabMyColonies.loadingColonyList',
    defaultMessage: 'Loading Colony List',
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
    <div>
      <ColonyGrid colonyAddresses={colonyAddresses} />
    </div>
  ) : (
    <>
      <p className={styles.loadingText}>
        <FormattedMessage {...MSG.loadingColonyList} />
        <DotsLoader />
      </p>
    </>
  );
};

export default TabMyColonies;
