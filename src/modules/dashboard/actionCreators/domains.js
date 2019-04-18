/* @flow */

import type { Address } from '~types';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

// eslint-disable-next-line import/prefer-default-export
export const fetchDomains = (
  colonyAddress: Address,
): Action<typeof ACTIONS.COLONY_DOMAINS_FETCH> => ({
  type: ACTIONS.COLONY_DOMAINS_FETCH,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});
