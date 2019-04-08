/* @flow */

// $FlowFixMe until hooks flow types
import React, { Fragment, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';
import { addressEquals } from '~utils/strings';
import { TASK_STATE } from '~immutable';

import type { TaskType } from '~immutable';

import { SpinnerLoader } from '~core/Preloaders';
import TaskList from '~dashboard/TaskList';

import type { InitialTaskType } from './InitialTask.jsx';
import type { MyTasksFilterOptionType } from './constants';

import InitialTask from './InitialTask.jsx';
import { MY_TASKS_FILTER } from './constants';

import { currentUserTasksFetcher } from '../../fetchers';

import styles from './TabMyTasks.css';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyTasks.emptyText',
    // eslint-disable-next-line max-len
    defaultMessage: `It looks like you don't have any tasks. Visit your colonies to find a task to work on.`,
  },
});

type Props = {|
  currentUserAddress: string,
  filterOption: MyTasksFilterOptionType,
  initialTask: InitialTaskType,
  userClaimedProfile: boolean,
|};

const TabMyTasks = ({
  currentUserAddress,
  filterOption,
  initialTask,
  userClaimedProfile,
}: Props) => {
  const { isFetching: isFetchingTasks, data: tasks } = useDataFetcher<string[]>(
    currentUserTasksFetcher,
    [],
    [],
  );

  const filter = useCallback(
    ({ creatorAddress, worker, currentState }: TaskType) => {
      switch (filterOption) {
        case MY_TASKS_FILTER.CREATED:
          return addressEquals(creatorAddress, currentUserAddress);

        case MY_TASKS_FILTER.ASSIGNED:
          return worker && addressEquals(worker.address, currentUserAddress);

        case MY_TASKS_FILTER.COMPLETED:
          return currentState === TASK_STATE.FINALIZED;

        default:
          return true;
      }
    },
    [filterOption, currentUserAddress],
  );

  if (isFetchingTasks) return <SpinnerLoader />;

  if (!userClaimedProfile) {
    return (
      <Fragment>
        <InitialTask task={initialTask} />
        {tasks && tasks.length ? <TaskList draftIds={tasks} /> : null}
      </Fragment>
    );
  }
  return tasks && tasks.length ? (
    <TaskList draftIds={tasks} filter={filter} />
  ) : (
    <Fragment>
      <p className={styles.emptyText}>
        <FormattedMessage {...MSG.emptyText} />
      </p>
    </Fragment>
  );
};

export default TabMyTasks;
