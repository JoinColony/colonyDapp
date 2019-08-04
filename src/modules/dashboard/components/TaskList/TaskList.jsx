/* @flow */

import type { Node } from 'react';

// $FlowFixMe until hooks flow types
import React, { useMemo, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { Address } from '~types';
import type { DomainId, TaskDraftId, TaskType } from '~immutable';

import { mergePayload } from '~utils/actions';
import { TASK_STATE } from '~immutable';

import {
  useDataTupleSubscriber,
  useSelector,
  useDataFetcher,
} from '~utils/hooks';

import { ACTIONS } from '~redux';

import { TASKS_FILTER_OPTIONS } from '../shared/tasksFilter';
import { tasksByIdSubscriber } from '../../subscribers';
import { userColoniesFetcher } from '../../fetchers';
import { colonyNameSelector } from '../../selectors';
import { currentUserSelector } from '../../../users/selectors';

import Icon from '~core/Icon';
import { Table, TableBody } from '~core/Table';
import { ActionButton } from '~core/Button';
import TaskListItem from './TaskListItem.jsx';

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

type Props = {|
  draftIds: [Address, TaskDraftId][],
  emptyState?: Node,
  filteredDomainId?: DomainId,
  filterOption: string,
  walletAddress: Address,
  colonyAddress?: Address,
|};

const TaskList = ({
  draftIds = [],
  filteredDomainId,
  filterOption,
  emptyState,
  walletAddress,
  colonyAddress,
}: Props) => {
  const tasksData = useDataTupleSubscriber<TaskType>(
    tasksByIdSubscriber,
    draftIds,
  );
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

  const currentUser = useSelector(currentUserSelector);
  const { data: colonyAddresses } = useDataFetcher<Address[]>(
    userColoniesFetcher,
    [currentUser.profile.walletAddress],
    [
      currentUser.profile.walletAddress,
      currentUser.profile.metadataStoreAddress,
    ],
  );
  const isSubscribed = (colonyAddresses || []).includes(colonyAddress);
  const transform = useCallback(mergePayload({ colonyAddress }), [
    colonyAddress,
  ]);

  const data = useSelector(colonyNameSelector, [colonyAddress]);

  const colonyName = colonyAddress ? data.record : undefined;

  return (
    <>
      {/* These empty states are getting a bit out of hand.
        We have now 4 different empty states for different occurences
        of the task list and different filter states
      */}
      {filteredTasksData.length === 0 && !colonyAddress && (
        <div className={taskListItemStyles.empty}>
          {emptyState || (
            <p>
              <FormattedMessage {...MSG.noTasks} />
            </p>
          )}
        </div>
      )}
      {filteredTasksData.length === 0 && colonyAddress ? (
        <div>
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
                     * @NOTE If the current user hasn't claimed a profile yet, then don't show the
                     * subscribe to colony call to action
                     */
                    isSubscribed: currentUser.profile.username
                      ? isSubscribed
                      : true,
                    myColonies: (
                      <ActionButton
                        className={taskListItemStyles.subscribe}
                        error={ACTIONS.USER_COLONY_SUBSCRIBE_ERROR}
                        submit={ACTIONS.USER_COLONY_SUBSCRIBE}
                        success={ACTIONS.USER_COLONY_SUBSCRIBE_SUCCESS}
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
        </div>
      ) : (
        <Table data-test="dashboardTaskList" scrollable>
          <TableBody>
            {filteredTasksData.map(taskData => (
              <TaskListItem key={taskData.key} data={taskData} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default TaskList;
