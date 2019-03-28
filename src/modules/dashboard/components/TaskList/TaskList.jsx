/* @flow */

// $FlowFixMe until hooks flow types
import React, { useState, useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Node } from 'react';

import { Table, TableBody } from '~core/Table';
import { SpinnerLoader } from '~core/Preloaders';

import type { TaskType } from '~immutable';

import TaskListItem from './TaskListItem.jsx';

const MSG = defineMessages({
  noTasks: {
    id: 'dashboard.TaskList.noTasks',
    defaultMessage: 'No tasks',
  },
});

type Props = {|
  // Array of draftIds
  tasks?: string[],
  filter?: (task: TaskType) => boolean,
  isLoading?: boolean,
  emptyState?: Node,
|};

const TaskList = ({ tasks = [], filter, isLoading, emptyState }: Props) => {
  // keep track of which items aren't rendering due to being filtered out
  const [taskVisibility, setTaskVisibility] = useState({});
  const handleWillRender = useCallback(
    (draftId: string, willRender: boolean) => {
      if (taskVisibility[draftId] === willRender) return;
      setTaskVisibility({
        ...taskVisibility,
        [draftId]: willRender,
      });
    },
    [taskVisibility],
  );
  const visibleTaskCount = useMemo(
    () =>
      Object.values(taskVisibility).reduce(
        (count, isVisible) => (isVisible ? count + 1 : count),
        0,
      ),
    [taskVisibility],
  );

  // if the draftIds change, reset the state
  useMemo(() => setTaskVisibility({}), [tasks]);

  if (isLoading) return <SpinnerLoader />;

  return (
    <>
      <Table data-test="dashboardTaskList" scrollable>
        <TableBody>
          {tasks.map(draftId => (
            <TaskListItem
              key={draftId}
              draftId={draftId}
              filter={filter}
              willRender={handleWillRender}
            />
          ))}
          {!visibleTaskCount &&
            (emptyState || (
              <p>
                <FormattedMessage {...MSG.noTasks} />
              </p>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TaskList;
