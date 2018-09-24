/* @flow */

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ColonyGrid from '~core/ColonyGrid';

import styles from './TabMyTasks.css';

import TaskList from '../TaskList';

import mockColonies from './__datamocks__/mockColonies';

const MSG = defineMessages({
  emptyText: {
    id: 'dashboard.Dashboard.TabMyTasks.emptyText',
    defaultMessage: `It looks like you have not worked on any colonies.
Why don't you check out one of these colonies for tasks that you can complete:`,
  },
});

type Props = {
  // TODO: Type better when data structure is known
  /** Tasks for MyTasks table */
  tasks: Array<Object>,
};

const TabMyTasks = ({ tasks }: Props) => {
  if (tasks && tasks.length) {
    return <TaskList tasks={tasks} />;
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
