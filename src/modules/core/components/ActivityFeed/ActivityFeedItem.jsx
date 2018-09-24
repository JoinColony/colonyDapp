/* @flow */
import React, { Fragment } from 'react';

import { TableRow, TableCell } from '~core/Table';
import Time from '~core/Time';
import UserMention from '~core/UserMention';

import type { Activity } from './types';

import styles from './ActivityFeedItem.css';

type Props = {
  activity: Activity,
};

const ActivityFeedItem = ({
  activity: { action, user, task, organization, domainTag, date: activityDate },
}: Props) => (
  <TableRow>
    <TableCell className={styles.activityFeedItemCell}>
      <div className={styles.placeholderItem}>
        <p>
          {action}{' '}
          {user && (
            <Fragment>
              <UserMention ensName={user} /> to{' '}
            </Fragment>
          )}
          <b>{task}</b>
        </p>
        <p>
          <b>
            {organization} in #{domainTag}
          </b>{' '}
          |{' '}
          <small>
            <Time value={activityDate} />
          </small>
        </p>
        <div className={styles.placeholderCoverUp} />
      </div>
    </TableCell>
  </TableRow>
);

export default ActivityFeedItem;
