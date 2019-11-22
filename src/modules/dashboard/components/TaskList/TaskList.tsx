import React, { ReactNode, useMemo, useCallback, DependencyList } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { DomainId, TaskDraftId, TaskType } from '~immutable/index';
import { TaskStates } from '~data/constants';
import { mergePayload } from '~utils/actions';
import {
  useDataTupleSubscriber,
  useSelector,
  useDataSubscriber,
} from '~utils/hooks';
import { tasksByIdSubscriber, userColoniesSubscriber } from '../../subscribers';
import {
  TasksFilterOptions,
  TasksFilterOptionType,
} from '../shared/tasksFilter';
import { ActionTypes } from '~redux/index';
import { colonyNameSelector } from '../../selectors';
import { currentUserSelector } from '../../../users/selectors';
import Icon from '~core/Icon';
import { Table, TableBody } from '~core/Table';
import { ActionButton } from '~core/Button';
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
  draftIds: [Address, TaskDraftId][];
  emptyState?: ReactNode;
  filteredDomainId?: DomainId;
  filterOption: TasksFilterOptionType;
  walletAddress: Address;
  colonyAddress?: Address;
  showEmptyState?: boolean;
}

const TaskList = ({
  draftIds = [],
  filteredDomainId,
  filterOption,
  emptyState,
  walletAddress,
  colonyAddress,
  showEmptyState = true,
}: Props) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterOption, filteredDomainId, walletAddress] as DependencyList,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortingOrderOption] as DependencyList,
  );

  const filteredTasksData = useMemo(
    () =>
      filter
        ? tasksData
            .sort(sort as any)
            .filter(({ data }) => (data ? filter(data) : true))
        : tasksData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, sort, tasksData] as DependencyList,
  );

  const currentUser = useSelector(currentUserSelector);
  const { data: colonyAddresses } = useDataSubscriber(
    userColoniesSubscriber,
    [currentUser.profile.walletAddress],
    [
      currentUser.profile.walletAddress,
      currentUser.profile.metadataStoreAddress,
    ],
  );
  const isSubscribed = (colonyAddresses || []).includes(
    // Casting should be ok here as we don't have any sparse arrays
    colonyAddress as string,
  );
  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ] as DependencyList);

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
                    isSubscribed: currentUser.profile.username
                      ? isSubscribed
                      : true,
                    myColonies: (
                      <ActionButton
                        className={taskListItemStyles.subscribe}
                        error={ActionTypes.USER_COLONY_SUBSCRIBE_ERROR}
                        submit={ActionTypes.USER_COLONY_SUBSCRIBE}
                        success={ActionTypes.USER_COLONY_SUBSCRIBE_SUCCESS}
                        transform={transform}
                      >
                        <FormattedMessage tagName="span" {...MSG.myColonies} />
                      </ActionButton>
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
