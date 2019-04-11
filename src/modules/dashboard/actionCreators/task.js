/* @flow */

import { ACTIONS } from '~redux';

import type { TaskDraftId } from '~immutable';
import type { Action } from '~redux';
import type { Address, ENSName } from '~types';

const keyPath = (draftId: TaskDraftId) => ({ keyPath: [draftId] });

export const taskFetch = (
  colonyName: ENSName,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH> => ({
  type: ACTIONS.TASK_FETCH,
  payload: { colonyName, draftId },
  meta: keyPath(draftId),
});

export const taskFetchComments = (
  colonyName: ENSName,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH_COMMENTS> => ({
  type: ACTIONS.TASK_FETCH_COMMENTS,
  payload: { colonyName, draftId },
  meta: keyPath(draftId),
});

export const taskSetWorker = (
  colonyName: ENSName,
  draftId: TaskDraftId,
  worker: Address,
): Action<typeof ACTIONS.TASK_WORKER_ASSIGN> => ({
  type: ACTIONS.TASK_WORKER_ASSIGN,
  payload: {
    colonyName,
    draftId,
    worker,
  },
  meta: keyPath(draftId),
});
