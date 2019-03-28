/* @flow */

// $FlowFixMe until hooks flow types
import React, { Fragment, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';
import { TASK_STATE } from '~immutable';

import type { TaskType } from '~immutable';

import { SpinnerLoader } from '~core/Preloaders';
import TaskList from '~dashboard/TaskList';

import type { InitialTaskType } from './InitialTask.jsx';

import InitialTask from './InitialTask.jsx';

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
  currentUser: string,
  filterOption: *,
  initialTask: InitialTaskType,
  userClaimedProfile: boolean,
|};

const TabMyTasks = ({
  currentUser,
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
    ({ creator, worker, currentState }: TaskType) => {
      switch (filterOption) {
        case 'created':
          return creator.toLowerCase() === currentUser.toLowerCase();

        case 'assigned':
          return (
            worker && worker.address.toLowerCase() === currentUser.toLowerCase()
          );

        case 'completed':
          return currentState === TASK_STATE.FINALIZED;

        default:
          return true;
      }
    },
    [filterOption, currentUser],
  );

  if (isFetchingTasks) return <SpinnerLoader />;

  if (!userClaimedProfile) {
    return (
      <Fragment>
        <InitialTask task={initialTask} />
        {tasks && tasks.length ? <TaskList tasks={tasks} /> : null}
      </Fragment>
    );
  }
  return tasks && tasks.length ? (
    <TaskList tasks={tasks} filter={filter} />
  ) : (
    <Fragment>
      <p className={styles.emptyText}>
        <FormattedMessage {...MSG.emptyText} />
      </p>
    </Fragment>
  );
};

export default TabMyTasks;
