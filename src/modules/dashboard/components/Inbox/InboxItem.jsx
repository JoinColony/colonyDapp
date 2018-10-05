/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import camelcase from 'camelcase';

import TimeRelative from '~core/TimeRelative';
import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';

import styles from './InboxItem.css';

import type { InboxElement, InboxAction } from './types';

const MSG = defineMessages({
  actionAddedSkillTag: {
    id: 'dashboard.Inbox.InboxItem.actionAddedSkillTag',
    defaultMessage: '{user} added skill tag to: {task}',
  },
  actionAssignedUser: {
    id: 'dashboard.Inbox.InboxItem.actionAssignedUser',
    defaultMessage: '{user} assigned you a task: {task}',
  },
  actionCommentedOn: {
    id: 'dashboard.Inbox.InboxItem.actionCommentedOn',
    defaultMessage: '{user} commented on: {task}',
  },
  actionAsksToConfirmAssignment: {
    id: 'dashboard.Inbox.InboxItem.actionAsksToConfirmAssignment',
    defaultMessage: '{user} asks to confirm assignment: {task}',
  },
  actionAssignedYouATask: {
    id: 'dashboard.Inbox.InboxItem.actionAssignedYouATask',
    defaultMessage: '{user} assigned you a task: {task}',
  },
  inboxMeta: {
    id: 'dashboard.Inbox.InboxItem.inboxMeta',
    defaultMessage: '{colonyName} in {domain}',
  },
});

const displayName = 'dashboard.Inbox.InboxItem';

type Props = {
  item: InboxElement,
};

const getEventActionKey = (actionType: InboxAction) =>
  camelcase(`action-${actionType}`);

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
        {...MSG[getEventActionKey(action)]}
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
        <FormattedMessage
          {...MSG.inboxMeta}
          values={{
            colonyName,
            domain,
          }}
        />

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
