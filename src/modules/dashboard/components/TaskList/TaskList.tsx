import React, {
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
  Fragment,
} from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Address } from '~types/index';
import { DomainId } from '~immutable/index';
import {
  useColonyNameLazyQuery,
  useLoggedInUser,
  useSubscribeToColonyMutation,
  AnyTask,
  useUserColonyAddressesQuery,
} from '~data/index';
import Icon from '~core/Icon';
import { Table, TableBody } from '~core/Table';
import Button from '~core/Button';

import {
  TasksFilterOptions,
  TasksFilterOptionType,
} from '../shared/tasksFilter';
import TaskListItem from './TaskListItem';

import taskListItemStyles from './TaskListItem.css';

const MSG = defineMessages({
  noTasks: {
    id: 'dashboard.TaskList.noTasks',
    defaultMessage: `It looks like you don't have any tasks.
      Visit your colonies to find a task to work on.`,
  },
  colonyToJoin: {
    id: 'dashboard.TaskList.colonyToJoin',
    defaultMessage: 'Colony',
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
  joinColony: {
    id: 'dashboard.TaskList.joinColony',
    defaultMessage: `It looks like there are no open tasks right now.
      {hasJoined, select,
        true {}
        false {Join the {colonyToJoin},
          grab a coffee, and check again later.}}`,
  },
});

interface Props {
  tasks: AnyTask[];
  emptyState?: ReactNode;
  filteredDomainId?: DomainId;
  filterOption: TasksFilterOptionType;
  colonyAddress?: Address;
  showEmptyState?: boolean;
}

const TaskList = ({
  tasks = [],
  filteredDomainId,
  filterOption,
  emptyState,
  colonyAddress,
  showEmptyState = true,
}: Props) => {
  const { username, walletAddress } = useLoggedInUser();

  const [loadColonyName, { data: colonyNameData }] = useColonyNameLazyQuery();

  useEffect(() => {
    if (colonyAddress) {
      loadColonyName({ variables: { address: colonyAddress } });
    }
  }, [colonyAddress, loadColonyName]);

  const [subscribeToColonyMutation] = useSubscribeToColonyMutation();
  const subscribeToColony = useCallback(() => {
    if (colonyAddress) {
      subscribeToColonyMutation({ variables: { input: { colonyAddress } } });
    }
  }, [subscribeToColonyMutation, colonyAddress]);

  const filter = useCallback(
    ({
      creatorAddress,
      assignedWorker,
      cancelledAt,
      ethDomainId,
      finalizedAt,
    }: AnyTask) => {
      if (filteredDomainId && filteredDomainId !== ethDomainId) return false;

      const taskIsOpen = !finalizedAt && !cancelledAt;

      switch (filterOption) {
        case TasksFilterOptions.CREATED:
          return (
            creatorAddress && creatorAddress === walletAddress && taskIsOpen
          );

        case TasksFilterOptions.ASSIGNED:
          return (
            assignedWorker && assignedWorker.id === walletAddress && taskIsOpen
          );

        case TasksFilterOptions.COMPLETED:
          return !!finalizedAt;

        case TasksFilterOptions.DISCARDED:
          return !!cancelledAt;

        case TasksFilterOptions.ALL_OPEN:
          return taskIsOpen;

        default:
          return !cancelledAt;
      }
    },
    [filterOption, filteredDomainId, walletAddress],
  );

  const sortingOrderOption = 'desc';
  const sort = useCallback(
    (first: AnyTask, second: AnyTask) => {
      if (!(first && second)) return 0;

      return sortingOrderOption === 'desc'
        ? second.createdAt - first.createdAt
        : first.createdAt - second.createdAt;
    },
    [sortingOrderOption],
  );

  const filteredTasksData: AnyTask[] = useMemo(
    () =>
      filter
        ? tasks.sort(sort).filter(task => (task ? filter(task) : true))
        : tasks,
    [filter, sort, tasks],
  );

  // const colonyAddresses = [] as string[];
  const { data: userData } = useUserColonyAddressesQuery({
    variables: { address: walletAddress },
  });

  const hasJoined =
    typeof colonyAddress == 'string' &&
    userData &&
    userData.user &&
    userData.user.colonyAddresses &&
    userData.user.colonyAddresses.includes(colonyAddress);

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

  const colonyName = colonyNameData && colonyNameData.colonyName;

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
                  {...MSG.joinColony}
                  values={{
                    /*
                     * If the current user hasn't claimed a profile yet, then don't show the
                     * subscribe to colony call to action
                     */
                    hasJoined: username ? hasJoined : true,
                    colonyToJoin: (
                      <Button
                        className={taskListItemStyles.subscribe}
                        onClick={subscribeToColony}
                      >
                        <FormattedMessage
                          tagName="span"
                          {...MSG.colonyToJoin}
                        />
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
        {filteredTasksData.map(taskData => (
          <Fragment key={taskData.id}>
            {taskData.colony && <TaskListItem task={taskData} />}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskList;
