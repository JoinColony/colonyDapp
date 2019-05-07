/* @flow */

import type { Address, WithKey } from '~types';
import type {
  ContractTransactionType,
  TaskDraftId,
  TokenReferenceType,
  UserProfileType,
} from '~immutable';

import type {
  ActionType,
  ActionTypeWithPayload,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type UserActionTypes = {|
  USER_AVATAR_REMOVE: UniqueActionType<
    typeof ACTIONS.USER_AVATAR_REMOVE,
    void,
    void,
  >,
  USER_AVATAR_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_AVATAR_REMOVE_ERROR,
    void,
  >,
  USER_AVATAR_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_AVATAR_REMOVE_SUCCESS,
    {| address: string |},
    void,
  >,
  USER_AVATAR_UPLOAD: UniqueActionType<
    typeof ACTIONS.USER_AVATAR_UPLOAD,
    {| data: string |},
    void,
  >,
  USER_AVATAR_UPLOAD_ERROR: ErrorActionType<
    typeof ACTIONS.USER_AVATAR_UPLOAD_ERROR,
    void,
  >,
  USER_AVATAR_UPLOAD_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_AVATAR_UPLOAD_SUCCESS,
    {|
      address: string,
      avatar: string,
      hash: string,
    |},
    void,
  >,
  USER_BY_USERNAME_FETCH: ActionTypeWithPayload<
    typeof ACTIONS.USER_BY_USERNAME_FETCH,
    {| username: string |},
  >,
  USER_COLONY_SUBSCRIBE: ActionTypeWithPayload<
    typeof ACTIONS.USER_COLONY_SUBSCRIBE,
    {| colonyAddress: Address |},
  >,
  USER_COLONY_SUBSCRIBE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_COLONY_SUBSCRIBE_ERROR,
    void,
  >,
  USER_COLONY_SUBSCRIBE_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_COLONY_SUBSCRIBE,
    {| colonyAddress: Address |},
  >,
  USER_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_FETCH,
    {| userAddress: string |},
    WithKey,
  >,
  USER_FETCH_ERROR: ErrorActionType<typeof ACTIONS.USER_FETCH_ERROR, WithKey>,
  USER_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_FETCH_SUCCESS,
    UserProfileType,
    WithKey,
  >,
  // In the future we could specify in the payload which permission(s) we would like to fetch
  USER_PERMISSIONS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_PERMISSIONS_FETCH,
    {| colonyAddress: Address |},
    WithKey,
  >,
  USER_PERMISSIONS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_PERMISSIONS_FETCH_ERROR,
    WithKey,
  >,
  USER_PERMISSIONS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_PERMISSIONS_FETCH,
    {|
      colonyAddress: Address,
      permissions: { +canEnterRecoveryMode?: boolean },
    |},
    WithKey,
  >,
  USER_PROFILE_UPDATE: UniqueActionType<
    typeof ACTIONS.USER_PROFILE_UPDATE,
    {|
      bio?: string,
      displayName?: string,
      location?: string,
      website?: string,
    |},
    void,
  >,
  USER_PROFILE_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_PROFILE_UPDATE_ERROR,
    void,
  >,
  USER_PROFILE_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_PROFILE_UPDATE_SUCCESS,
    UserProfileType,
    void,
  >,
  USER_SUBSCRIBED_COLONIES_FETCH: ActionType<
    typeof ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH,
  >,
  USER_SUBSCRIBED_COLONIES_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH_ERROR,
    void,
  >,
  USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS,
    Address[],
  >,
  USER_SUBSCRIBED_TASKS_FETCH: ActionType<
    typeof ACTIONS.USER_SUBSCRIBED_TASKS_FETCH,
  >,
  USER_SUBSCRIBED_TASKS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_SUBSCRIBED_TASKS_FETCH_ERROR,
    void,
  >,
  USER_SUBSCRIBED_TASKS_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_SUBSCRIBED_TASKS_FETCH_SUCCESS,
    [Address, TaskDraftId][],
  >,
  USER_TASK_SUBSCRIBE: ActionTypeWithPayload<
    typeof ACTIONS.USER_TASK_SUBSCRIBE,
    {| colonyAddress: Address, draftId: TaskDraftId |},
  >,
  USER_TASK_SUBSCRIBE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_TASK_SUBSCRIBE_ERROR,
    void,
  >,
  USER_TASK_SUBSCRIBE_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_TASK_SUBSCRIBE,
    {| colonyAddress: Address, draftId: TaskDraftId |},
  >,
  USER_TOKEN_TRANSFERS_FETCH: ActionType<
    typeof ACTIONS.USER_TOKEN_TRANSFERS_FETCH,
  >,
  USER_TOKEN_TRANSFERS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_TOKEN_TRANSFERS_FETCH_ERROR,
    void,
  >,
  USER_TOKEN_TRANSFERS_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_TOKEN_TRANSFERS_FETCH_SUCCESS,
    {|
      transactions: ContractTransactionType[],
    |},
  >,
  USER_TOKENS_FETCH: ActionType<typeof ACTIONS.USER_TOKENS_FETCH>,
  USER_TOKENS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_TOKENS_FETCH_ERROR,
    void,
  >,
  USER_TOKENS_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_TOKENS_FETCH_SUCCESS,
    {|
      tokens: TokenReferenceType[],
    |},
  >,
  USER_TOKENS_UPDATE: ActionTypeWithPayload<
    typeof ACTIONS.USER_TOKENS_UPDATE,
    {|
      tokens: string[],
    |},
  >,
  USER_TOKENS_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_TOKENS_UPDATE_ERROR,
    void,
  >,
  USER_TOKENS_UPDATE_SUCCESS: ActionType<
    typeof ACTIONS.USER_TOKENS_UPDATE_SUCCESS,
  >,
  USER_LOGOUT: ActionType<typeof ACTIONS.USER_LOGOUT>,
  USER_LOGOUT_ERROR: ErrorActionType<typeof ACTIONS.USER_LOGOUT_ERROR>,
  USER_LOGOUT_SUCCESS: ActionType<typeof ACTIONS.USER_LOGOUT_SUCCESS>,
|};
