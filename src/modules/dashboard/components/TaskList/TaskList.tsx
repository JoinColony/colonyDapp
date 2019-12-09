import React, { ReactNode, useMemo, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { DomainId, TaskType } from '~immutable/index';
import { TaskStates } from '~data/constants';
import { useDataTupleSubscriber, useSelector } from '~utils/hooks';
import Icon from '~core/Icon';
import { Table, TableBody } from '~core/Table';
import Button from '~core/Button';
import { useLoggedInUser } from '~data/helpers';
import { useSubscribeToColonyMutation } from '~data/index';

import { tasksByIdSubscriber } from '../../subscribers';
import {
  TasksFilterOptions,
  TasksFilterOptionType,
} from '../shared/tasksFilter';
import { colonyNameSelector } from '../../selectors';
import TaskListItem from './TaskListItem';

import taskListItemStyles from './TaskListItem.css';

const MSG = defineMessages({
  noTasks: {
    id: 'dashboard.TaskList.noTasks',
    defaultMessage: `It looks like you don't have any tasks.
      Visit your colonies to find a task to work on.`,
  },
  subscribe: {
    id: 'dashboard.TaskList.subscribe',
    defaultMessage: 'Subscribe to Colony',
  },
  myColonies: {
    id: 'dashboard.TaskList.myColonies',
    defaultMessage: 'My Colonies',
  },
  noTaskDescription: {
    id: 'dashboard.TaskList.noTaskDescription',
    defaultMessage: 'No tasks here!',
  },
  noTaskAddition: {
    id: 'dashboard.TaskList.noTaskAddition',
    defaultMessage: 'Change Domains or filters to check for other tasks.',
  },
  welcomeToColony: {
    id: 'dashboard.TaskList.welcomeToColony',
    defaultMessage: `Welcome to {colonyNameExists, select,
      true {{colonyName}}
      other {the Colony}
    }!`,
  },
  subscribeToColony: {
    id: 'dashboard.TaskList.subscribeToColony',
    defaultMessage: `It looks like there are no open tasks right now.
      {isSubscribed, select,
        true {}
        false {Add this colony to {myColonies},
          grab a coffee, and check again later.}}`,
  },
});

interface Props {
  draftIds: string[];
  emptyState?: ReactNode;
  filteredDomainId?: DomainId;
  filterOption: TasksFilterOptionType;
  colonyAddress?: Address;
  showEmptyState?: boolean;
}

const TaskList = ({
  draftIds = [],
  filteredDomainId,
  filterOption,
  emptyState,
  colonyAddress,
  showEmptyState = true,
}: Props) => {
  const { username, walletAddress } = useLoggedInUser();
  const tasksData = useDataTupleSubscriber<TaskType>(
    tasksByIdSubscriber,
    draftIds,
  );
  const filter = useCallback(
    ({ creatorAddress, workerAddress, currentState, domainId }: TaskType) => {
      if (filteredDomainId && filteredDomainId !== domainId) return false;

      const taskIsOpen = currentState === TaskStates.ACTIVE;

      switch (filterOption) {
        case TasksFilterOptions.CREATED:
          return creatorAddress === walletAddress && taskIsOpen;

        case TasksFilterOptions.ASSIGNED:
          return workerAddress === walletAddress && taskIsOpen;

        case TasksFilterOptions.COMPLETED:
          return currentState === TaskStates.FINALIZED;

        case TasksFilterOptions.DISCARDED:
          return currentState === TaskStates.CANCELLED;

        case TasksFilterOptions.ALL_OPEN:
          return taskIsOpen;

        default:
          return currentState !== TaskStates.CANCELLED;
      }
    },
    [filterOption, filteredDomainId, walletAddress],
  );

  const sortingOrderOption = 'desc';
  const sort = useCallback(
    (
      { data: first }: { data: TaskType },
      { data: second }: { data: TaskType },
    ) => {
      if (!(first && second)) return 0;

      return sortingOrderOption === 'desc'
        ? (second as any).createdAt - (first as any).createdAt
        : (first as any).createdAt - (second as any).createdAt;
    },
    [sortingOrderOption],
  );

  const filteredTasksData = useMemo(
    () =>
      filter
        ? tasksData
            .sort(sort as any)
            .filter(({ data }) => (data ? filter(data) : true))
        : tasksData,
    [filter, sort, tasksData],
  );

  const [subscribeToColonyMutation] = useSubscribeToColonyMutation();
  const subscribeToColony = useCallback(() => {
    if (colonyAddress) {
      // FIXME @james can we remove the nested input here?
      subscribeToColonyMutation({ variables: { input: { colonyAddress } } });
    }
  }, [subscribeToColonyMutation, colonyAddress]);

  // FIXME get the colony addresses for the user
  const colonyAddresses = [] as string[];

  const isSubscribed =
    typeof colonyAddress == 'string' && colonyAddresses.includes(colonyAddress);

  const data = useSelector(colonyNameSelector, [colonyAddress]);

  const colonyName = colonyAddress ? data && data.record : undefined;

  /*
   * These empty states are getting a bit out of hand. We have now 4 different
   * empty states for different occurences of the task list and different
   * filter states.
   */
  if (filteredTasksData.length === 0 && !colonyAddress) {
    return (
      <div className={taskListItemStyles.empty}>
        {emptyState || (
          <p>
            <FormattedMessage {...MSG.noTasks} />
          </p>
        )}
      </div>
    );
  }

  return filteredTasksData.length === 0 && colonyAddress ? (
    <div>
      {showEmptyState && (
        <>
          {filteredDomainId ? (
            <div>
              <Icon
                className={taskListItemStyles.noTask}
                name="empty-task"
                title={MSG.noTasks}
                viewBox="0 0 120 120"
              />
              <div className={taskListItemStyles.emptyStateElements}>
                <FormattedMessage tagName="p" {...MSG.noTaskDescription} />
              </div>
              <div className={taskListItemStyles.emptyStateElements}>
                <FormattedMessage tagName="p" {...MSG.noTaskAddition} />
              </div>
            </div>
          ) : (
            <div>
              <Icon
                className={taskListItemStyles.noTask}
                name="cup"
                title={MSG.noTasks}
                viewBox="0 0 120 120"
              />
              <div className={taskListItemStyles.emptyStateElements}>
                <FormattedMessage
                  tagName="p"
                  {...MSG.welcomeToColony}
                  values={{
                    colonyNameExists: !!colonyName,
                    colonyName,
                  }}
                />
              </div>
              <div className={taskListItemStyles.emptyStateElements}>
                <FormattedMessage
                  tagName="p"
                  {...MSG.subscribeToColony}
                  values={{
                    /*
                     * If the current user hasn't claimed a profile yet, then don't show the
                     * subscribe to colony call to action
                     */
                    isSubscribed: username ? isSubscribed : true,
                    myColonies: (
                      <Button
                        className={taskListItemStyles.subscribe}
                        onClick={subscribeToColony}
                      >
                        <FormattedMessage tagName="span" {...MSG.myColonies} />
                      </Button>
                    ),
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  ) : (
    <Table
      data-test="dashboardTaskList"
      appearance={{ theme: 'rounder' }}
      scrollable
    >
      <TableBody>
        {filteredTasksData.map((taskData: any) => (
          <TaskListItem key={taskData.key} data={taskData} />
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskList;
