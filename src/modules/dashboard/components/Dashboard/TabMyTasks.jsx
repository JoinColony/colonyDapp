/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDataFetcher } from '~utils/hooks';

import { SpinnerLoader } from '~core/Preloaders';
import ColonyGrid from '~dashboard/ColonyGrid';
import TaskList from '~dashboard/TaskList';

import type { InitialTaskType } from './InitialTask.jsx';

import InitialTask from './InitialTask.jsx';

import { currentUserTasksFetcher } from '../../fetchers';

import styles from './TabMyTasks.css';

import mockColonies from '../../../../__mocks__/mockColonies';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyTasks.emptyText',
    defaultMessage: `It looks like you have not worked on any colonies.
Why don't you check out one of these colonies for tasks that you can complete:`,
  },
});

type Props = {|
  initialTask: InitialTaskType,
  userClaimedProfile: boolean,
|};

const TabMyTasks = ({ initialTask, userClaimedProfile }: Props) => {
  const { isFetching: isFetchingTasks, data: tasks } = useDataFetcher<string[]>(
    currentUserTasksFetcher,
    [],
    [],
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
    <TaskList tasks={tasks} />
  ) : (
    <Fragment>
      <p className={styles.emptyText}>
        <FormattedMessage {...MSG.emptyText} />
      </p>
      <div className={styles.coloniesContainer}>
        <ColonyGrid colonies={mockColonies} />
      </div>
    </Fragment>
  );
};

export default TabMyTasks;
