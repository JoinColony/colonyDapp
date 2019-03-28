/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';

import { SpinnerLoader } from '~core/Preloaders';
import ColonyGrid from '~dashboard/ColonyGrid';

import { currentUserColoniesFetcher } from '../../fetchers';

import styles from './TabMyTasks.css';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyColonies.emptyText',
    defaultMessage: `No colonies.`,
  },
});

const TabMyColonies = () => {
  const { isFetching: isFetchingColonies, data: colonies } = useDataFetcher<
    string[],
  >(currentUserColoniesFetcher, [], []);

  if (isFetchingColonies) return <SpinnerLoader />;

  return colonies && colonies.length ? (
    <ColonyGrid colonies={colonies} />
  ) : (
    <Fragment>
      <p className={styles.emptyText}>
        <FormattedMessage {...MSG.emptyText} />
      </p>
    </Fragment>
  );
};

export default TabMyColonies;
