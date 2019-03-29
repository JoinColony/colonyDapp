/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TableRow, TableCell } from '~core/Table';
import UserAvatarFactory from '~core/UserAvatar';
import PayoutsList from '~core/PayoutsList';
import Link from '~core/Link';

import styles from './TaskListItem.css';

import type { TaskType } from '~immutable';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
});

const UserAvatar = UserAvatarFactory();

const displayName = 'dashboard.TaskList.TaskListItem';

type Props = {|
  task: TaskType,
|};

const TaskListItem = ({
  task: { worker, draftId, payouts, reputation, title, colonyENSName },
}: Props) => (
  <TableRow>
    <TableCell className={styles.taskDetails}>
      <Link
        title={title}
        className={styles.taskDetailsTitle}
        to={`/colony/${colonyENSName}/task/${draftId}`}
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
      {worker && worker.address ? (
        <UserAvatar size="xs" address={worker.address} />
      ) : null}
    </TableCell>
  </TableRow>
);

TaskListItem.displayName = displayName;

export default TaskListItem;
