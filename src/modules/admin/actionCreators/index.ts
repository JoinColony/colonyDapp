import { Address } from '~types/index';
import { Action, ActionTypes } from '~redux/index';

export const fetchColonyTransactions = (
  colonyAddress: Address,
): Action<ActionTypes.COLONY_TRANSACTIONS_FETCH> => ({
  type: ActionTypes.COLONY_TRANSACTIONS_FETCH,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});

export const fetchColonyUnclaimedTransactions = (
  colonyAddress: Address,
): Action<ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH> => ({
  type: ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});
