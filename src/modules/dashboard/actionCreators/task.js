/* @flow */

import { ACTIONS } from '~redux';

import type { TaskDraftId } from '~immutable';
import type { Action } from '~redux';
import type { Address } from '~types';

export const fetchTask = (
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH> => ({
  type: ACTIONS.TASK_FETCH,
  payload: { draftId },
  meta: { key: draftId },
});

export const fetchTaskFeedItems = (
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FEED_ITEMS_FETCH> => ({
  type: ACTIONS.TASK_FEED_ITEMS_FETCH,
  payload: { draftId },
  meta: { key: draftId },
});

/**
 * @todo Wire up setting the task worker.
 */
export const taskSetWorker = (
  draftId: TaskDraftId,
  workerAddress: Address,
): Action<typeof ACTIONS.TASK_WORKER_ASSIGN> => ({
  type: ACTIONS.TASK_WORKER_ASSIGN,
  payload: {
    draftId,
    workerAddress,
  },
  meta: { key: draftId },
});
