/* @flow */

import type { Action } from '~redux';
import type { ENSName } from '~types';

import { ACTIONS } from '~redux';

export const userFetch = (
  address: string,
): Action<typeof ACTIONS.USER_FETCH> => ({
  type: ACTIONS.USER_FETCH,
  meta: { keyPath: [address] },
  payload: { address },
});

export const userByUsernameFetch = (
  username: string,
): Action<typeof ACTIONS.USER_BY_USERNAME_FETCH> => ({
  type: ACTIONS.USER_BY_USERNAME_FETCH,
  payload: { username },
});

export const userTokensFetch = (): Action<
  typeof ACTIONS.USER_TOKENS_FETCH,
> => ({
  type: ACTIONS.USER_TOKENS_FETCH,
});

export const userTokenTransfersFetch = (): Action<
  typeof ACTIONS.USER_TOKEN_TRANSFERS_FETCH,
> => ({
  type: ACTIONS.USER_TOKEN_TRANSFERS_FETCH,
});

export const currentUserGetBalance = (): Action<
  typeof ACTIONS.CURRENT_USER_GET_BALANCE,
> => ({
  type: ACTIONS.CURRENT_USER_GET_BALANCE,
});

export const userPermissionsFetch = (
  ensName: ENSName,
): Action<typeof ACTIONS.USER_PERMISSIONS_FETCH> => ({
  type: ACTIONS.USER_PERMISSIONS_FETCH,
  payload: { ensName },
  meta: { keyPath: [ensName] },
});

export const userTokensUpdate = (
  tokens: string[],
): Action<typeof ACTIONS.USER_TOKENS_UPDATE> => ({
  type: ACTIONS.USER_TOKENS_UPDATE,
  payload: { tokens },
});

export const subscribeToColony = (
  colonyAddress: string,
): Action<typeof ACTIONS.USER_COLONY_SUBSCRIBE> => ({
  type: ACTIONS.USER_COLONY_SUBSCRIBE,
  payload: { address: colonyAddress },
});

export const subscribeToTask = (
  draftId: string,
): Action<typeof ACTIONS.USER_TASK_SUBSCRIBE> => ({
  type: ACTIONS.USER_TASK_SUBSCRIBE,
  payload: { draftId },
});

export const currentUserFetchTasks = () => ({
  type: ACTIONS.USER_SUBSCRIBED_TASKS_FETCH,
});

export const currentUserFetchColonies = () => ({
  type: ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH,
});
