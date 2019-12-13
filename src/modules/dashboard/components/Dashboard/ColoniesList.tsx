import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import Link from '~core/Link';
import { CREATE_COLONY_ROUTE } from '~routes/index';
import { useLoggedInUser, useUserColonyIdsQuery } from '~data/index';

import ColoniesListItem from './ColoniesListItem';

import styles from './ColoniesList.css';

const MSG = defineMessages({
  loadingColonies: {
    id: 'dashboard.Dashboard.ColoniesList.loadingColonies',
    defaultMessage: 'Loading your Colonies list...',
  },
  emptyText: {
    id: 'dashboard.Dashboard.ColoniesList.emptyText',
    defaultMessage: 'It looks like you don’t have any colonies.',
  },
  createColonyLink: {
    id: 'dashboard.Dashboard.ColoniesList.createColonyLink',
    defaultMessage: `Create Colony`,
  },
});

const displayName = 'dashboard.Dashboard.ColoniesList';

const ColoniesList = () => {
  const { walletAddress } = useLoggedInUser();
  const { data } = useUserColonyIdsQuery({
    variables: { address: walletAddress },
  });

  if (!data) {
    return (
      <div className={styles.loader}>
        <SpinnerLoader appearance={{ size: 'medium' }} />
        <span className={styles.loaderText}>
          <FormattedMessage {...MSG.loadingColonies} />
        </span>
      </div>
    );
  }

  const {
    user: { colonies },
  } = data;
  const colonyAddresses = colonies.map(({ id }) => id);

  if (colonyAddresses && colonyAddresses.length) {
    return (
      <div className={styles.main}>
        {colonyAddresses.map(colonyAddress => (
          <ColoniesListItem key={colonyAddress} colonyAddress={colonyAddress} />
        ))}
      </div>
    );
  }

  return (
    <p className={styles.emptyText}>
      <FormattedMessage {...MSG.emptyText} />
      <Link
        to={CREATE_COLONY_ROUTE}
        text={MSG.createColonyLink}
        className={styles.createColonyLink}
      />
    </p>
  );
};

ColoniesList.displayName = displayName;

export default ColoniesList;
