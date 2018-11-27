/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { InitialTaskType } from './InitialTask.jsx';

import ColonyGrid from '~core/ColonyGrid';
import TaskList from '~dashboard/TaskList';
import InitialTask from './InitialTask.jsx';

import styles from './TabMyTasks.css';

import mockColonies from './__datamocks__/mockColonies';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyTasks.emptyText',
    defaultMessage: `It looks like you have not worked on any colonies.
Why don't you check out one of these colonies for tasks that you can complete:`,
  },
});

type Props = {
  colonyLabel: string,
  // TODO: Type better when data structure is known
  /** Tasks for MyTasks table */
  tasks: Array<Object>,
  initialTask: InitialTaskType,
  userClaimedProfile: boolean,
};

const TabMyTasks = ({
  colonyLabel,
  initialTask,
  tasks,
  userClaimedProfile,
}: Props) => {
  if (!userClaimedProfile) {
    return (
      <Fragment>
        <InitialTask task={initialTask} />
        {tasks && tasks.length ? (
          <TaskList colonyLabel={colonyLabel} tasks={tasks} />
        ) : null}
      </Fragment>
    );
  }
  if (tasks && tasks.length) {
    return <TaskList colonyLabel={colonyLabel} tasks={tasks} />;
  }
  return (
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
