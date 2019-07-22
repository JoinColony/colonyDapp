/* @flow */

import nanoid from 'nanoid';

import type { Action } from '~redux';
import type { Address } from '~types';

import { createAddress } from '~types';
import { ACTIONS } from '~redux';
import type { TaskDraftId } from '~immutable';

export const userFetch = (
  userAddress: Address,
): Action<typeof ACTIONS.USER_FETCH> => ({
  type: ACTIONS.USER_FETCH,
  meta: { key: createAddress(userAddress) },
  payload: { userAddress },
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
  meta: { key: createAddress(colonyAddress) },
  payload: { colonyAddress },
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
  meta: { id: nanoid() },
});

export const subscribeToTask = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.USER_TASK_SUBSCRIBE> => ({
  type: ACTIONS.USER_TASK_SUBSCRIBE,
  payload: { colonyAddress, draftId },
});

export const currentUserFetchTasks = (): Action<
  typeof ACTIONS.USER_SUBSCRIBED_TASKS_FETCH,
> => ({
  type: ACTIONS.USER_SUBSCRIBED_TASKS_FETCH,
});

export const fetchUserColonies = (
  walletAddress: Address,
  metadataStoreAddress: string,
): Action<typeof ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH> => ({
  type: ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH,
  meta: { key: createAddress(walletAddress) },
  payload: { walletAddress, metadataStoreAddress },
});
