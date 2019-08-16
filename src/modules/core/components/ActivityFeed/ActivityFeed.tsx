import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '~core/Table';
import { ActivityFeedItemType } from '~immutable/index';
import ActivityFeedItem from './ActivityFeedItem';
import styles from './ActivityFeed.css';

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

interface Props {
  activities: ActivityFeedItemType[];
}

const displayName = 'ActivityFeed';

const ActivityFeed = ({ activities }: Props) => (
  // Remove this `div.main` and associated styles once it's actually implemented
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
