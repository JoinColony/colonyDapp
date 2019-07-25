/* @flow */

import type { Node } from 'react';

// $FlowFixMe until hooks flow types
import React, { useMemo, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';
import type { DomainId, TaskDraftId, TaskType } from '~immutable';

import { TASK_STATE } from '~immutable';
import { useDataTupleFetcher } from '~utils/hooks';
import { TASKS_FILTER_OPTIONS } from '../shared/tasksFilter';
import { tasksByIdFetcher } from '../../fetchers';

import { Table, TableBody, TableCell, TableRow } from '~core/Table';
import TaskListItem from './TaskListItem.jsx';

import taskListItemStyles from './TaskListItem.css';

const MSG = defineMessages({
  noTasks: {
    id: 'dashboard.TaskList.noTasks',
    defaultMessage: 'There are no tasks here.',
  },
});

type Props = {|
  draftIds: [Address, TaskDraftId][],
  emptyState?: Node,
  filteredDomainId?: DomainId,
  filterOption: string,
  walletAddress: Address,
|};

const TaskList = ({
  draftIds = [],
  emptyState,
  filteredDomainId,
  filterOption,
  walletAddress,
}: Props) => {
  const tasksData = useDataTupleFetcher<TaskType>(tasksByIdFetcher, draftIds);
  const filter = useCallback(
    ({ creatorAddress, workerAddress, currentState, domainId }: TaskType) => {
      if (filteredDomainId && filteredDomainId !== domainId) return false;

      switch (filterOption) {
        case TASKS_FILTER_OPTIONS.CREATED:
          return creatorAddress === walletAddress;

        case TASKS_FILTER_OPTIONS.ASSIGNED:
          return workerAddress === walletAddress;

        case TASKS_FILTER_OPTIONS.COMPLETED:
          return currentState === TASK_STATE.FINALIZED;

        case TASKS_FILTER_OPTIONS.DISCARDED:
          return currentState === TASK_STATE.CANCELLED;

        case TASKS_FILTER_OPTIONS.ALL_OPEN:
          return currentState === TASK_STATE.ACTIVE;

        default:
          return currentState !== TASK_STATE.CANCELLED;
      }
    },
    [filterOption, walletAddress, filteredDomainId],
  );

  const sortingOrderOption = 'desc';
  const sort = useCallback(
    (
      { data: first }: { data: TaskType },
      { data: second }: { data: TaskType },
    ) => {
      if (!(first && second)) return 0;

      return sortingOrderOption === 'desc'
        ? second.createdAt - first.createdAt
        : first.createdAt - second.createdAt;
    },
    [sortingOrderOption],
  );

  const filteredTasksData = useMemo(
    () =>
      filter
        ? tasksData
            .sort(sort)
            .filter(({ data }) => (data ? filter(data) : true))
        : tasksData,
    [filter, tasksData, sort],
  );

  return (
    <>
      <Table data-test="dashboardTaskList" scrollable>
        <TableBody>
          {filteredTasksData.map(taskData => (
            <TaskListItem key={taskData.key} data={taskData} />
          ))}
          {filteredTasksData.length === 0 && (
            <TableRow>
              <TableCell className={taskListItemStyles.empty}>
                {emptyState || (
                  <p>
                    <FormattedMessage {...MSG.noTasks} />
                  </p>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default TaskList;
