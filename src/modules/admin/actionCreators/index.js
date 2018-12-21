/* @flow */

import type { ENSName } from '~types';

import {
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
} from '../actionTypes';

export const fetchColonyTransactions = (ensName: ENSName) => ({
  type: COLONY_FETCH_TRANSACTIONS,
  payload: { ensName },
});

export const fetchColonyUnclaimedTransactions = (ensName: ENSName) => ({
  type: COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  payload: { ensName },
});
