import { Address } from '~types/index';
import { Action, ActionTypes } from '~redux/index';

export const fetchRoles = (
  colonyAddress: Address,
): Action<ActionTypes.COLONY_ROLES_FETCH> => ({
  type: ActionTypes.COLONY_ROLES_FETCH,
  payload: {
    colonyAddress,
  },
  meta: {
    key: colonyAddress,
  },
});
