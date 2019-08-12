/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';

import { useDataSubscriber, useSelector } from '~utils/hooks';

import { SpinnerLoader, DotsLoader } from '~core/Preloaders';
import ColonyGrid from '~dashboard/ColonyGrid';

import { currentUserSelector } from '../../../users/selectors';
import { userColoniesSubscriber } from '../../subscribers';

import styles from './TabMyColonies.css';

const MSG = defineMessages({
  loadingColonyList: {
    id: 'dashboard.Dashboard.TabMyColonies.loadingColonyList',
    defaultMessage: 'Loading Colony List',
  },
});

const TabMyColonies = () => {
  const currentUser = useSelector(currentUserSelector);
  const { data: colonyAddresses, isFetching } = useDataSubscriber<Address[]>(
    userColoniesSubscriber,
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
      <div className={styles.loadingText}>
        <FormattedMessage {...MSG.loadingColonyList} />
        <DotsLoader />
      </div>
    </>
  );
};

export default TabMyColonies;
