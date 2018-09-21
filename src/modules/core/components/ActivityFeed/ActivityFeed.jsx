/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '~core/Table';

import styles from './ActivityFeed.css';

import ActivityFeedPlaceholder from './ActivityFeedPlaceholder.jsx';

const MSG = defineMessages({
  title: {
    id: 'ActivityFeed.title',
    defaultMessage: 'Activity',
  },
  comingSoonText: {
    id: 'ActivityFeed.comingSoonText',
    defaultMessage: 'Coming Soon',
  },
});

const displayName = 'ActivityFeed';

const ActivityFeed = () => (
  // TODO remove this `div.main` and associated styles once it's actually implemented
  <div className={styles.main}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>
            <FormattedMessage {...MSG.title} /> (<FormattedMessage
              {...MSG.comingSoonText}
            />)
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <ActivityFeedPlaceholder />
      </TableBody>
    </Table>
  </div>
);

ActivityFeed.displayName = displayName;

export default ActivityFeed;
