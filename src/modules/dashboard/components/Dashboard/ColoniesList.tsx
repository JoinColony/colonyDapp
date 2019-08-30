import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { useDataFetcher, useSelector } from '~utils/hooks';

import { SpinnerLoader } from '~core/Preloaders';

// import ColonyGrid from '~dashboard/ColonyGrid';
// import Link from '~core/Link';

import { currentUserSelector } from '../../../users/selectors';
import { userColoniesFetcher } from '../../fetchers';
// import { CREATE_COLONY_ROUTE } from '~routes/index';

import styles from './ColoniesList.css';

const MSG = defineMessages({
  loadingColonies: {
    id: 'dashboard.Dashboard.ColoniesList.loadingColonies',
    defaultMessage: 'Loading your Colonies list...',
  },
});

const displayName = 'dashboard.Dashboard.ColoniesList';

const ColoniesList = () => {
  const currentUser = useSelector(currentUserSelector);
  const { data: colonyAddresses, isFetching } = useDataFetcher<Address[]>(
    userColoniesFetcher,
    [currentUser.profile.walletAddress],
    [
      currentUser.profile.walletAddress,
      currentUser.profile.metadataStoreAddress,
    ],
  );

  if (true) {
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
        <span className={styles.loaderText}>
          <FormattedMessage {...MSG.loadingColonies} />
        </span>
      </div>
    );
  }
  return null;
};

ColoniesList.displayName = displayName;

export default ColoniesList;
