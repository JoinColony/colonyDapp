/* @flow */

import type { ENSName, Address } from '~types';

import { ACTIONS } from '~redux';

export const fetchCurrentUserTasks = () => ({
  type: 'TASK_FETCH_IDS_FOR_CURRENT_USER',
});

export const fetchTaskComments = (
  colonyENSName: ENSName,
  commentsStoreAddress: string,
) => ({
  type: ACTIONS.TASK_FETCH_COMMENTS,
  meta: {
    keyPath: [colonyENSName, commentsStoreAddress],
  },
});

export const setTaskWorker = (
  colonyAddress: Address,
  draftId: string,
  assignee: string,
) => ({
  type: ACTIONS.TASK_WORKER_ASSIGN,
  meta: {
    keyPath: [draftId],
  },
  payload: {
    colonyENSName: colonyAddress,
    draftId,
    worker: assignee,
  },
});
