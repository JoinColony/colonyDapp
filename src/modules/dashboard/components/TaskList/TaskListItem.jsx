/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import UserAvatar from '~core/UserAvatar';
import PayoutsList from '~core/PayoutsList';
import Link from '~core/Link';

import styles from './TaskListItem.css';

import type { ColonyRecord, TaskRecord } from '~types';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
});

const displayName = 'dashboard.TaskList.TaskListItem';

type Props = {
  colony: ColonyRecord,
  task: TaskRecord,
};

const TaskListItem = ({
  colony: { name },
  task: { assignee, id, payouts, reputation, title },
}: Props) => (
  <TableRow>
    <TableCell className={styles.taskDetails}>
      <Link
        title={title}
        className={styles.taskDetailsTitle}
        to={`colony/${name}/task/${id}`}
        text={title}
      />
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
      {assignee ? (
        <UserAvatar
          size="xs"
          walletAddress={assignee.walletAddress}
          username={assignee.username}
        />
      ) : null}
    </TableCell>
  </TableRow>
);

TaskListItem.displayName = displayName;

export default TaskListItem;
