/* @flow */

import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

export const fetchColony = (ensName: ENSName) => ({
  type: ACTIONS.COLONY_FETCH,
  payload: {
    ensName,
  },
  meta: { keyPath: [ensName] },
});

export const fetchColonyENSName = (colonyAddress: string) => ({
  type: ACTIONS.COLONY_ENS_NAME_FETCH,
  meta: { keyPath: [colonyAddress] },
});
