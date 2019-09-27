import { Address } from '~types/index';
import { Action, ActionTypes } from '~redux/index';

export const fetchDomains = (
  colonyAddress: Address,
  options?: { fetchRoles: boolean },
): Action<ActionTypes.COLONY_DOMAINS_FETCH> => ({
  type: ActionTypes.COLONY_DOMAINS_FETCH,
  payload: { colonyAddress, options },
  meta: { key: colonyAddress },
});
