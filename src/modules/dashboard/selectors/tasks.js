/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord, TaskDraftId, TaskUserType } from '~immutable';
import { TASK_STATE } from '~immutable/constants';
import { addressEquals } from '~utils/strings';

import { DASHBOARD_ALL_TASKS, DASHBOARD_NAMESPACE as ns } from '../constants';
import { currentUserAddressSelector } from '../../users/selectors';

/*
 * Utils
 */
const didClaimPayout = (taskUser: TaskUserType, address: string) =>
  addressEquals(taskUser && taskUser.address, address) &&
  taskUser.didClaimPayout;

/*
 * Getters
 */
const getAllTasks = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TASKS], ImmutableMap());

const getDraftIdFromProps = (
  state: RootStateRecord,
  { draftId }: { draftId: TaskDraftId },
) => draftId;

const getColonyENSNameFromProps = (
  state: RootStateRecord,
  { colonyENSName }: { colonyENSName: string },
) => colonyENSName;

/*
 * Selectors
 */
export const colonyTasksSelector = createSelector(
  getAllTasks,
  getColonyENSNameFromProps,
  (allTasks, colonyENSName) => allTasks.get(colonyENSName, ImmutableMap()),
);

export const taskSelector = createSelector(
  colonyTasksSelector,
  getDraftIdFromProps,
  (tasks, draftId) => tasks.get(draftId),
);

// TODO consider whether the following are best as selectors, or whether
// they should be functions used in components
export const isTaskManager = createSelector(
  taskSelector,
  currentUserAddressSelector,
  (task, address) =>
    task && task.manager && addressEquals(task.manager.address, address),
);

export const isTaskWorker = createSelector(
  taskSelector,
  currentUserAddressSelector,
  (task, address) =>
    task && task.worker && addressEquals(task.worker.address, address),
);

export const canTaskPayoutBeClaimed = createSelector(
  taskSelector,
  currentUserAddressSelector,
  (task, address) =>
    !!(
      task &&
      task.currentState === TASK_STATE.FINALIZED &&
      (didClaimPayout(task.worker, address) ||
        didClaimPayout(task.manager, address))
    ),
);

export const didTaskDueDateElapse = createSelector(
  taskSelector,
  // TODO consider not using a date in selectors like this, because
  // it might cause unwanted behaviour (e.g. selector invalidation)
  task => !!(task && task.dueDate && task.dueDate < new Date()),
);

// TODO update this for the task payments workflow
export const canTaskBeFinalized = createSelector(
  taskSelector,
  task =>
    task &&
    task.currentState === TASK_STATE.REVEAL &&
    task.manager &&
    task.manager.didRate &&
    task.worker &&
    task.worker.didRate,
);
