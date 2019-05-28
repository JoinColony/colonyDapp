/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { InboxElement } from '../types';

import { ACTIONS } from '~redux';
import { useAsyncFunction } from '~utils/hooks';
import { Table, TableBody } from '~core/Table';
import Heading from '~core/Heading';
import Button from '~core/Button';
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

const Inbox = ({ activities }: Props) => {
  const allReadActions = {
    submit: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS,
    success: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_SUCCESS,
    error: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_ERROR,
  };

  const markAllRead = useAsyncFunction({ ...allReadActions });
  return (
    <CenteredTemplate appearance={{ theme: 'alt' }}>
      <div className={styles.contentContainer}>
        <div className={styles.inboxHeading}>
          <Heading
            appearance={{ size: 'medium', margin: 'small' }}
            text={MSG.title}
          />
          <Button
            appearance={{ theme: 'blue' }}
            text={MSG.markAllRead}
            onClick={markAllRead}
          />
        </div>
        <div className={styles.inboxContainer}>
          <Table scrollable appearance={{ separators: 'borders' }}>
            <TableBody>
              {activities.reverse().map(activity => (
                <InboxItem key={activity.id} activity={activity} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </CenteredTemplate>
  );
};

Inbox.displayName = displayName;

export default Inbox;
