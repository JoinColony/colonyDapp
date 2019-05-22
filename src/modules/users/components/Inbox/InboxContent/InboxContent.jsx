/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { InboxElement } from '../types';

import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import CenteredTemplate from '~pages/CenteredTemplate';
import InboxItem from '../InboxItem';

import styles from './InboxContent.css';

const MSG = defineMessages({
  title: {
    id: 'users.Inbox.InboxContent.title',
    defaultMessage: 'Inbox',
  },
  markAllRead: {
    id: 'users.Inbox.InboxContent.markAllRead',
    defaultMessage: 'Mark all as read',
  },
});

const displayName = 'users.Inbox.InboxContent';

type Props = {
  activities: Array<InboxElement>,
};

/* eslint-disable no-console */
const markAllRead = () => console.log('markAllRead');
const markAsRead = id => console.log(`markAsRead${id}`);

const Inbox = ({ activities }: Props) => (
  <CenteredTemplate appearance={{ theme: 'alt' }}>
    <div className={styles.contentContainer}>
      <div className={styles.inboxHeading}>
        <Heading
          appearance={{ size: 'medium', margin: 'small' }}
          text={MSG.title}
        />
        {/*
         * @todo Handle read/unread notifications (inbox content).
         */}
        {/* <Button
          appearance={{ theme: 'blue' }}
          text={MSG.markAllRead}
          onClick={markAllRead}
        /> */}
      </div>
      <div className={styles.inboxContainer}>
        <Table scrollable appearance={{ separators: 'borders' }}>
          <TableBody>
            {activities.reverse().map(activity => (
              <InboxItem
                key={activity.id}
                activity={activity}
                /*
                 * @todo Handle read/unread notifications.
                 */
                // markAsRead={markAsRead}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </CenteredTemplate>
);

Inbox.displayName = displayName;

export default Inbox;
