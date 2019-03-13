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
  taskStoreAddress: string,
  assignee: string,
) => ({
  type: ACTIONS.TASK_ASSIGN,
  meta: {
    keyPath: [colonyAddress, taskStoreAddress, assignee],
  },
});
