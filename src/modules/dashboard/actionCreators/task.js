/* @flow */

import { ACTIONS } from '~redux';

import type { TaskDraftId } from '~immutable';
import type { Action } from '~redux';
import type { Address } from '~types';

const keyPath = (draftId: TaskDraftId) => ({ keyPath: [draftId] });

export const fetchTask = (
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH> => ({
  type: ACTIONS.TASK_FETCH,
  payload: { draftId },
  meta: keyPath(draftId),
});

// TODO in #580 this will probably be TASK_FETCH_FEED_ITEMS
export const fetchTaskComments = (
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH_COMMENTS> => ({
  type: ACTIONS.TASK_FETCH_COMMENTS,
  payload: { draftId },
  meta: keyPath(draftId),
});

export const fetchTaskMetadataForColony = (
  colonyAddress: Address,
): Action<typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY> => ({
  type: ACTIONS.TASK_FETCH_ALL_FOR_COLONY,
  payload: { colonyAddress },
  meta: { keyPath: [colonyAddress] },
});

// TODO this is unused
export const taskSetWorker = (
  draftId: TaskDraftId,
  worker: Address,
): Action<typeof ACTIONS.TASK_WORKER_ASSIGN> => ({
  type: ACTIONS.TASK_WORKER_ASSIGN,
  payload: {
    draftId,
    worker,
  },
  meta: keyPath(draftId),
});
