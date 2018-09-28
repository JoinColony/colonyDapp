/* @flow */

import React from 'react';
import formatDate from 'sugar-date/date/format';
import createDate from 'sugar-date/date/create';
import relative from 'sugar-date/date/relative';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';

import styles from './InboxItem.css';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.Inbox.InboxItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
  preposition: {
    id: 'dashboard.Inbox.InboxItem.preposition',
    defaultMessage: 'in',
  },
});

const displayName = 'dashboard.Inbox.InboxItem';

type Props = {
  // TODO: type better as soon as actual structure is known
  item: Object,
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
      <span className={styles.inboxDetail} title={user.username}>
        {user.username}
      </span>
      <span className={styles.inboxAction} title={action}>
        {action}
      </span>
      <span className={styles.inboxDetail} title={user.username}>
        {task}
      </span>
      <span className={styles.additionalDetails}>
        <span>{colonyName}</span>
        <span className={styles.preposition}>
          <FormattedMessage {...MSG.preposition} />
        </span>
        <span>{domain}</span>
        <span className={styles.pipe}>|</span>
        <span className={styles.time}>{relative(new Date(createdAt))}</span>
      </span>
    </TableCell>
  </TableRow>
);

InboxItem.displayName = displayName;

export default InboxItem;
