/* @flow */

import type { Action } from '~redux';
import type { Address } from '~types';

import { ACTIONS } from '~redux';
import type { TaskDraftId } from '~immutable';

export const userFetch = (
  userAddress: Address,
): Action<typeof ACTIONS.USER_FETCH> => ({
  type: ACTIONS.USER_FETCH,
  meta: { key: userAddress },
  payload: { userAddress },
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
  colonyAddress: Address,
): Action<typeof ACTIONS.USER_PERMISSIONS_FETCH> => ({
  type: ACTIONS.USER_PERMISSIONS_FETCH,
  payload: { colonyAddress },
  meta: { key: colonyAddress },
});

export const userTokensUpdate = (
  tokens: Address[],
): Action<typeof ACTIONS.USER_TOKENS_UPDATE> => ({
  type: ACTIONS.USER_TOKENS_UPDATE,
  payload: { tokens },
});

export const subscribeToColony = (
  colonyAddress: Address,
): Action<typeof ACTIONS.USER_COLONY_SUBSCRIBE> => ({
  type: ACTIONS.USER_COLONY_SUBSCRIBE,
  payload: { colonyAddress },
});

export const subscribeToTask = (
  draftId: TaskDraftId,
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
