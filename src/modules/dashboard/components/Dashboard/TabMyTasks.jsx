/* @flow */

import type { List } from 'immutable';

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { InitialTaskType } from './InitialTask.jsx';

import ColonyGrid from '~core/ColonyGrid';
import TaskList from '~dashboard/TaskList';
import InitialTask from './InitialTask.jsx';

import styles from './TabMyTasks.css';

import mockColonies from '../../../../__mocks__/mockColonies';

import type { ColonyRecord, TaskRecord } from '~types';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyTasks.emptyText',
    defaultMessage: `It looks like you have not worked on any colonies.
Why don't you check out one of these colonies for tasks that you can complete:`,
  },
});

type Props = {
  colony: ColonyRecord,
  /** Tasks for MyTasks table */
  tasks: List<TaskRecord>,
  initialTask: InitialTaskType,
  userClaimedProfile: boolean,
};

const TabMyTasks = ({
  colony,
  initialTask,
  tasks,
  userClaimedProfile,
}: Props) => {
  if (!userClaimedProfile) {
    return (
      <Fragment>
        <InitialTask task={initialTask} />
        {tasks && tasks.size ? (
          <TaskList colony={colony} tasks={tasks} />
        ) : null}
      </Fragment>
    );
  }
  return tasks && tasks.size ? (
    <TaskList colony={colony} tasks={tasks} />
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
