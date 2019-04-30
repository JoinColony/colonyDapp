/* @flow */

import { ACTIONS } from '~redux';

import type { TaskDraftId } from '~immutable';
import type { Action } from '~redux';
import type { Address } from '~types';

export const fetchTask = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH> => ({
  type: ACTIONS.TASK_FETCH,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

export const fetchTaskByColonyAddressAndDraftId = ([colonyAddress, draftId]: [
  Address,
  TaskDraftId,
]) => fetchTask(colonyAddress, draftId);

export const fetchTaskFeedItems = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FEED_ITEMS_FETCH> => ({
  type: ACTIONS.TASK_FEED_ITEMS_FETCH,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

/**
 * @todo Wire up setting the task worker.
 */
export const taskSetWorker = (
  colonyAddress: Address,
  draftId: TaskDraftId,
  workerAddress: Address,
): Action<typeof ACTIONS.TASK_WORKER_ASSIGN> => ({
  type: ACTIONS.TASK_WORKER_ASSIGN,
  payload: {
    colonyAddress,
    draftId,
    workerAddress,
  },
  meta: { key: draftId },
});
