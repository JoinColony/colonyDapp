/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { ENSName } from '~types';
import type { TaskType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';

import { colonyNameFetcher } from '../../fetchers';

import { TableRow, TableCell } from '~core/Table';
import PayoutsList from '~core/PayoutsList';
import Link from '~core/Link';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { SpinnerLoader } from '~core/Preloaders';

import styles from './TaskListItem.css';

const MSG = defineMessages({
  reputation: {
    id: 'dashboard.TaskList.TaskListItem.reputation',
    defaultMessage: '+{reputation} max rep',
  },
  untitled: {
    id: 'dashboard.TaskList.TaskListItem.untitled',
    defaultMessage: 'Untitled task',
  },
});

const UserAvatar = HookedUserAvatar();

const displayName = 'dashboard.TaskList.TaskListItem';

type Props = {|
  data: {|
    key: string,
    entry: [string, string],
    data: ?TaskType,
    isFetching: boolean,
    error: boolean,
  |},
|};

const TaskListItem = ({ data }: Props) => {
  const {
    data: task,
    entry: [colonyAddress, draftId],
    isFetching: isFetchingTask,
  } = data;
  const { workerAddress, payouts, reputation, title = MSG.untitled } =
    task || {};

  const {
    data: colonyName,
    isFetching: isFetchingColonyName,
  } = useDataFetcher<ENSName>(
    colonyNameFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  if (!task || !colonyName || isFetchingTask || isFetchingColonyName) {
    return (
      <TableRow>
        <TableCell className={styles.taskDetails}>
          <SpinnerLoader />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className={styles.taskDetails}>
        <Link
          title={title}
          className={styles.taskDetailsTitle}
          to={`/colony/${colonyName}/task/${draftId}`}
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
        {workerAddress && <UserAvatar size="xs" address={workerAddress} />}
      </TableCell>
    </TableRow>
  );
};

TaskListItem.displayName = displayName;

export default TaskListItem;
