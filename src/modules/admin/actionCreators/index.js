/* @flow */

import type { Address } from '~types';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const fetchColonyTransactions = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_FETCH_TRANSACTIONS> => ({
  type: ACTIONS.COLONY_FETCH_TRANSACTIONS,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});

export const fetchColonyUnclaimedTransactions = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS> => ({
  type: ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});
