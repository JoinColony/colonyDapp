/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';

import { useDataFetcher, useSelector } from '~utils/hooks';

import { SpinnerLoader } from '~core/Preloaders';
import ColonyGrid from '~dashboard/ColonyGrid';
import Link from '~core/Link';

import { currentUserSelector } from '../../../users/selectors';
import { userColoniesFetcher } from '../../fetchers';
import { CREATE_COLONY_ROUTE } from '~routes';

import styles from './TabMyColonies.css';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyColonies.emptyText',
    // eslint-disable-next-line max-len
    defaultMessage: `It looks like you don’t have any colonies. You’ll need an invite link to join a colony. Ask your community for a link or {link}.`,
  },
  createColonyLink: {
    id: 'dashboard.Dashboard.TabMyColonies.createColonyLink',
    defaultMessage: `create a new colony`,
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

  return colonyAddresses && colonyAddresses.length ? (
    <ColonyGrid colonyAddresses={colonyAddresses} />
  ) : (
    <Fragment>
      <p className={styles.emptyText}>
        <FormattedMessage
          {...MSG.emptyText}
          values={{
            link: (
              <Link
                to={CREATE_COLONY_ROUTE}
                text={MSG.createColonyLink}
                className={styles.createColonyLink}
              />
            ),
          }}
        />
      </p>
    </Fragment>
  );
};

export default TabMyColonies;
