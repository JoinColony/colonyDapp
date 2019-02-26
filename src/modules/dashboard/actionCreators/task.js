/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

// eslint-disable-next-line import/prefer-default-export
export const fetchTaskComments = (
  colonyENSName: ENSName,
  commentStoreAddress: string,
) => ({
  type: ACTIONS.TASK_FETCH_COMMENTS,
  meta: {
    keyPath: [colonyENSName, commentStoreAddress],
  },
});
