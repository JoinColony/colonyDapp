/* @flow */
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { List } from 'immutable';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '~core/Table';

import type { ActivityFeedItemRecord } from '~immutable';

import styles from './ActivityFeed.css';

import ActivityFeedItem from './ActivityFeedItem.jsx';

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

type Props = {
  activities: List<ActivityFeedItemRecord>,
};

const displayName = 'ActivityFeed';

const ActivityFeed = ({ activities }: Props) => (
  // TODO remove this `div.main` and associated styles once it's actually implemented
  <div className={styles.main}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell className={styles.activityFeedHeaderCell}>
            <FormattedMessage {...MSG.title} /> (
            <FormattedMessage {...MSG.comingSoonText} />)
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map(activity => (
          <ActivityFeedItem key={activity.id} activity={activity} />
        ))}
      </TableBody>
    </Table>
  </div>
);

ActivityFeed.displayName = displayName;

export default ActivityFeed;
