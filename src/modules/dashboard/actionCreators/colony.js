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

export const fetchColonyAvatar = (hash: string) => ({
  type: ACTIONS.COLONY_AVATAR_FETCH,
  meta: { keyPath: [hash] },
});

export const fetchColonyENSName = (colonyAddress: string) => ({
  type: ACTIONS.COLONY_ENS_NAME_FETCH,
  meta: { keyPath: [colonyAddress] },
});
