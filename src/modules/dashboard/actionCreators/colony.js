/* @flow */

import type { ENSName } from '~types';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const fetchColony = (
  colonyName: ENSName,
): Action<typeof ACTIONS.COLONY_FETCH> => ({
  type: ACTIONS.COLONY_FETCH,
  payload: { colonyName },
  meta: { keyPath: [colonyName] },
});

export const fetchColonyName = (
  colonyAddress: string,
): Action<typeof ACTIONS.COLONY_ENS_NAME_FETCH> => ({
  type: ACTIONS.COLONY_ENS_NAME_FETCH,
  payload: { colonyAddress },
  meta: { keyPath: [colonyAddress] },
});
