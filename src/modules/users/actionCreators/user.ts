import nanoid from 'nanoid';

import { AllActions, ActionTypes } from '~redux/index';
import { Address, createAddress } from '~types/index';
import { TaskDraftId } from '~immutable/index';

export const userTokensFetch = (): AllActions => ({
  type: ActionTypes.USER_TOKENS_FETCH,
});

export const userTokenTransfersFetch = (): AllActions => ({
  type: ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
});

export const subscribeToColony = (colonyAddress: Address): AllActions => ({
  type: ActionTypes.USER_COLONY_SUBSCRIBE,
  payload: { colonyAddress },
  meta: { id: nanoid() },
});

export const subscribeToTask = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): AllActions => ({
  type: ActionTypes.USER_TASK_SUBSCRIBE,
  payload: { colonyAddress, draftId },
});

export const currentUserFetchTasks = (): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_TASKS_FETCH,
});

export const fetchUserColonies = (
  walletAddress: Address,
  metadataStoreAddress: string,
): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH,
  meta: { key: createAddress(walletAddress) },
  payload: { walletAddress, metadataStoreAddress },
});

export const userColoniesSubStart = (
  walletAddress: Address,
  metadataStoreAddress: string,
): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_START,
  meta: { key: createAddress(walletAddress) },
  payload: { walletAddress, metadataStoreAddress },
});

export const userColoniesSubStop = (walletAddress: Address): AllActions => ({
  type: ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_STOP,
  meta: { key: createAddress(walletAddress) },
  payload: { walletAddress },
});

export const inboxItemsFetch = (): AllActions => ({
  type: ActionTypes.INBOX_ITEMS_FETCH,
});
