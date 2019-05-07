/* @flow */

import type { Address } from '~types';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const fetchColonyTransactions = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_TRANSACTIONS_FETCH> => ({
  type: ACTIONS.COLONY_TRANSACTIONS_FETCH,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});

export const fetchColonyUnclaimedTransactions = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH> => ({
  type: ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});
