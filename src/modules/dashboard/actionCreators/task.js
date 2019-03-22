/* @flow */

import type { ENSName, Address } from '~types';

import { ACTIONS } from '~redux';

// eslint-disable-next-line import/prefer-default-export
export const fetchTaskComments = (
  colonyENSName: ENSName,
  commentsStoreAddress: string,
) => ({
  type: ACTIONS.TASK_FETCH_COMMENTS,
  meta: {
    keyPath: [colonyENSName, commentsStoreAddress],
  },
});

// eslint-disable-next-line import/prefer-default-export
export const setTaskWorker = (
  colonyAddress: Address,
  draftId: string,
  assignee: string,
) => ({
  type: ACTIONS.TASK_WORKER_ASSIGN,
  meta: {
    keyPath: [colonyAddress, draftId, assignee],
  },
});
