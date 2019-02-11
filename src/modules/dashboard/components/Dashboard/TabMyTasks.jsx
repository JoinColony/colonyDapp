/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { InitialTaskType } from './InitialTask.jsx';

import ColonyGrid from '~core/ColonyGrid';
import TaskList from '~dashboard/TaskList';
import InitialTask from './InitialTask.jsx';

import styles from './TabMyTasks.css';

import mockColonies from '../../../../__mocks__/mockColonies';

import type { TaskType } from '~immutable';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyTasks.emptyText',
    defaultMessage: `It looks like you have not worked on any colonies.
Why don't you check out one of these colonies for tasks that you can complete:`,
  },
});

type Props = {|
  /** Tasks for MyTasks table */
  tasks: Array<TaskType>,
  initialTask: InitialTaskType,
  userClaimedProfile: boolean,
|};

const TabMyTasks = ({ initialTask, tasks, userClaimedProfile }: Props) => {
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
