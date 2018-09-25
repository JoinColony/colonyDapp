/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';
import PayoutsList from '~core/PayoutsList';

import styles from './TaskListItem.css';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
});

const displayName = 'dashboard.TaskList.TaskListItem';

type Props = {
  // TODO: type better as soon as actual structure is known
  task: Object,
};

const TaskListItem = ({
  task: { assignee, payouts, reputation, title },
}: Props) => (
  <TableRow>
    <TableCell className={styles.taskDetails}>
      <span className={styles.taskDetailsTitle} title={title}>
        {title}
      </span>
      {reputation && (
        <span className={styles.taskDetailsReputation}>
          <FormattedMessage
            {...MSG.reputation}
            values={{ reputation: reputation.toString() }}
          />
        </span>
      )}
    </TableCell>
    <TableCell className={styles.taskPayouts}>
      <PayoutsList payouts={payouts} nativeToken="CLNY" />
    </TableCell>
    <TableCell className={styles.userAvatar}>
      <UserAvatar
        size="xs"
        walletAddress={assignee.walletAddress}
        username={assignee.username}
      />
    </TableCell>
  </TableRow>
);

TaskListItem.displayName = displayName;

export default TaskListItem;
