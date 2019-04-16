/* @flow */

import type { Address } from '~types';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

// eslint-disable-next-line import/prefer-default-export
export const fetchRoles = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_ROLES_FETCH> => ({
  type: ACTIONS.COLONY_ROLES_FETCH,
  payload: {
    colonyAddress,
  },
  meta: {
    keyPath: [colonyAddress],
  },
});
