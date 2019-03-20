/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet, List } from 'immutable';
import { createSelector } from 'reselect';

import type { RootStateRecord, TaskDraftId, TaskUserType } from '~immutable';

import { TASK_STATE } from '~immutable/constants';
import { addressEquals } from '~utils/strings';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_TASKS } from '../constants';
import { currentUserAddressSelector } from '../../users/selectors';
import { USERS_CURRENT_USER, USERS_NAMESPACE } from '../../users/constants';

/*
 * Utils
 */
const didClaimPayout = (taskUser: TaskUserType, address: string) =>
  addressEquals(taskUser && taskUser.address, address) &&
  taskUser.didClaimPayout;

/*
 * Getters
 */
const getDraftIdFromProps = (
  state: RootStateRecord,
  { draftId }: { draftId: TaskDraftId },
) => draftId;

const getTaskRefs = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_TASKS], ImmutableMap());

const getUserOpenDraftIds = (state: RootStateRecord) =>
  state.getIn(
    [USERS_NAMESPACE, USERS_CURRENT_USER, ns, 'record', 'closed'],
    ImmutableSet(),
  );

const getUserClosedDraftIds = (state: RootStateRecord) =>
  state.getIn(
    [USERS_NAMESPACE, USERS_CURRENT_USER, ns, 'record', 'open'],
    ImmutableSet(),
  );

const getTaskRefsFromDraftIds = (taskRefs, draftIds) =>
  taskRefs.filter((_, draftId) => draftIds.has(draftId));

/*
 * Selectors
 */
export const taskRefSelector = createSelector(
  getTaskRefs,
  getDraftIdFromProps,
  (taskRefs, draftId) => taskRefs.get(draftId),
);

export const taskStorePropsSelector = createSelector(
  taskRefSelector,
  taskRef => {
    if (taskRef && taskRef.has('record')) {
      const {
        colonyENSName,
        commentsStoreAddress,
        taskStoreAddress,
      } = taskRef.get('record');
      return { taskStoreAddress, commentsStoreAddress, colonyENSName };
    }
    return null;
  },
);

export const taskSelector = createSelector(
  taskRefSelector,
  taskRef => (taskRef ? taskRef.getIn(['record', 'task']) : null),
);

export const currentUserOpenTaskRefsSelector = createSelector(
  getTaskRefs,
  getUserOpenDraftIds,
  getTaskRefsFromDraftIds,
);

export const currentUserClosedTaskRefsSelector = createSelector(
  getTaskRefs,
  getUserClosedDraftIds,
  getTaskRefsFromDraftIds,
);

export const taskFeedItemsSelector = createSelector(
  taskRefSelector,
  taskRef =>
    taskRef ? taskRef.getIn(['record', 'feedItems'], List()) : List(),
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
