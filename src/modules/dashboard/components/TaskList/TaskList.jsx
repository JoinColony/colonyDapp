/* @flow */

import type { Node } from 'react';

// $FlowFixMe until hooks flow types
import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TaskDraftId, TaskType } from '~immutable';

import { useMultiDataFetcher } from '~utils/hooks';
import { tasksByIdFetcher } from '../../fetchers';

import { Table, TableBody } from '~core/Table';
import TaskListItem from './TaskListItem.jsx';

const MSG = defineMessages({
  noTasks: {
    id: 'dashboard.TaskList.noTasks',
    defaultMessage: 'No tasks',
  },
});

type Props = {|
  draftIds?: TaskDraftId[],
  filter?: (task: TaskType) => boolean,
  emptyState?: Node,
|};

const TaskList = ({ draftIds = [], filter, emptyState }: Props) => {
  const tasksData = useMultiDataFetcher<TaskType>(tasksByIdFetcher, draftIds);
  const filteredTasksData = useMemo(
    () =>
      filter
        ? tasksData.filter(({ data }) => (data ? filter(data) : true))
        : tasksData,
    [tasksData, filter],
  );

  return (
    <>
      <Table data-test="dashboardTaskList" scrollable>
        <TableBody>
          {filteredTasksData.map(taskData => (
            <TaskListItem key={taskData.key} data={taskData} />
          ))}
        </TableBody>
      </Table>
      {!filteredTasksData.length &&
        (emptyState || (
          <p>
            <FormattedMessage {...MSG.noTasks} />
          </p>
        ))}
    </>
  );
};

export default TaskList;
