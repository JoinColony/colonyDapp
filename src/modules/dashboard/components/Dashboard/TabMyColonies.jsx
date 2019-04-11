/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';

import { SpinnerLoader } from '~core/Preloaders';
import ColonyGrid from '~dashboard/ColonyGrid';
import Link from '~core/Link';

import { currentUserColoniesFetcher } from '../../fetchers';
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
  const {
    isFetching: isFetchingColonies,
    data: colonyAddresses,
  } = useDataFetcher<string[]>(currentUserColoniesFetcher, [], []);

  if (isFetchingColonies) return <SpinnerLoader />;

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
