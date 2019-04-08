/* @flow */

import { ACTIONS } from '~redux';

import type { TaskDraftId } from '~immutable';
import type { Action } from '~redux';
import type { Address, ENSName } from '~types';

const keyPath = (draftId: TaskDraftId) => ({ keyPath: [draftId] });

export const taskFetch = (
  colonyENSName: ENSName,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH> => ({
  type: ACTIONS.TASK_FETCH,
  payload: { colonyENSName, draftId },
  meta: keyPath(draftId),
});

export const taskFetchComments = (
  colonyENSName: ENSName,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH_COMMENTS> => ({
  type: ACTIONS.TASK_FETCH_COMMENTS,
  payload: { colonyENSName, draftId },
  meta: keyPath(draftId),
});

export const taskSetWorker = (
  colonyENSName: ENSName,
  draftId: TaskDraftId,
  worker: Address,
): Action<typeof ACTIONS.TASK_WORKER_ASSIGN> => ({
  type: ACTIONS.TASK_WORKER_ASSIGN,
  payload: {
    colonyENSName,
    draftId,
    worker,
  },
  meta: keyPath(draftId),
});
