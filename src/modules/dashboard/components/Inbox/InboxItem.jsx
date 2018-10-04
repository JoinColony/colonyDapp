/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';

import styles from './InboxItem.css';

import type { InboxElement } from './types';

const MSG = defineMessages({
  preposition: {
    id: 'dashboard.Inbox.InboxItem.preposition',
    defaultMessage: 'in',
  },
  actionAddedSkillTag: {
    id: 'ActivityFeedItem.actionAddedSkillTag',
    defaultMessage: '{user} added skill tag to {task}',
  },
  actionAssignedUser: {
    id: 'ActivityFeedItem.actionAssignedUser',
    defaultMessage: '{user} assigned {task}',
  },
  actionCommentedOn: {
    id: 'ActivityFeedItem.actionCommentedOn',
    defaultMessage: '{user} commented on {task}',
  },
  actionAsksToConfirmAssignment: {
    id: 'ActivityFeedItem.actionAsksToConfirmAssignment',
    defaultMessage: '{user} asks to confirm assignment {task}',
  },
  actionAssignedYouATask: {
    id: 'ActivityFeedItem.actionAssignedYouATask',
    defaultMessage: '{user} assigned you {task}',
  },
});

const displayName = 'dashboard.Inbox.InboxItem';

type Props = {
  item: InboxElement,
};

const InboxItem = ({
  item: { user, action, task, domain, colonyName, createdAt },
}: Props) => (
  <TableRow className={styles.inboxRow}>
    <TableCell className={styles.inboxDetails}>
      <UserAvatar
        size="xxs"
        walletAddress={user.walletAddress}
        username={user.username}
        className={styles.UserAvatar}
      />
      <FormattedMessage
        className={styles.inboxAction}
        {...MSG[action]}
        values={{
          user: (
            <span className={styles.inboxDetail} title={user.username}>
              {user.username}
            </span>
          ),
          task: (
            <span className={styles.inboxDetail} title={user.username}>
              {task}
            </span>
          ),
        }}
      />

      <span className={styles.additionalDetails}>
        <span>{colonyName}</span>
        <span className={styles.preposition}>
          <FormattedMessage {...MSG.preposition} />
        </span>
        <span>{domain}</span>
        <span className={styles.pipe}>|</span>
        <span className={styles.time}>
          <TimeRelative value={createdAt} />
        </span>
      </span>
    </TableCell>
  </TableRow>
);

InboxItem.displayName = displayName;

export default InboxItem;
