/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';

import styles from './InboxItem.css';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.Inbox.InboxItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
});

const displayName = 'dashboard.Inbox.InboxItem';

type Props = {
  // TODO: type better as soon as actual structure is known
  item: Object,
};

const InboxItem = ({ item: { user, action, task } }: Props) => (
  <TableRow>
    <TableCell className={styles.userAvatar}>
      <UserAvatar
        size="xxs"
        walletAddress={user.walletAddress}
        username={user.username}
      />
    </TableCell>
    <TableCell className={styles.inboxDetails}>
      <span className={styles.inboxDetail} title={user.username}>
        {user.username}
      </span>
      <span className={styles.inboxAction} title={action}>
        {action}
      </span>
      <span className={styles.inboxDetail} title={user.username}>
        {task}
      </span>
    </TableCell>
  </TableRow>
);

InboxItem.displayName = displayName;

export default InboxItem;
