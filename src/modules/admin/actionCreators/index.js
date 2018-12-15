/* @flow */

import type { ENSName } from '~types';

import { COLONY_FETCH_TRANSACTIONS } from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const fetchColonyTransactions = (ensName: ENSName) => ({
  type: COLONY_FETCH_TRANSACTIONS,
  payload: { ensName },
});
