/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

const fetchTaskComments = (
  colonyENSName: ENSName,
  commentStoreAddress: string,
) => ({
  type: ACTIONS.TASK_FETCH_COMMENTS,
  meta: {
    keyPath: [colonyENSName, commentStoreAddress],
  },
});

export default fetchTaskComments;
