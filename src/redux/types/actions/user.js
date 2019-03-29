/* @flow */

import type { ENSName, WithKeyPathDepth1 } from '~types';
import type {
  ContractTransactionType,
  TokenReferenceType,
  UserMetadataType,
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
  USER_AVATAR_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_AVATAR_FETCH,
    {| address: string, avatarIpfsHash: string |},
    WithKeyPathDepth1,
  >,
  USER_AVATAR_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_AVATAR_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_AVATAR_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_AVATAR_FETCH_SUCCESS,
    {|
      address: string,
      avatar: ?string,
    |},
    WithKeyPathDepth1,
  >,
  USER_BY_USERNAME_FETCH: ActionTypeWithPayload<
    typeof ACTIONS.USER_BY_USERNAME_FETCH,
    {| username: string |},
  >,
  USER_COLONY_SUBSCRIBE: ActionTypeWithPayload<
    typeof ACTIONS.USER_COLONY_SUBSCRIBE,
    {| address: string |},
  >,
  USER_COLONY_SUBSCRIBE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_COLONY_SUBSCRIBE_ERROR,
    void,
  >,
  USER_COLONY_SUBSCRIBE_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_COLONY_SUBSCRIBE,
    {| address: string |},
  >,
  USER_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_FETCH,
    {| address: string |},
    WithKeyPathDepth1,
  >,
  USER_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_FETCH_SUCCESS,
    UserProfileType,
    WithKeyPathDepth1,
  >,
  USER_METADATA_SET: ActionTypeWithPayload<
    typeof ACTIONS.USER_METADATA_SET,
    $Shape<UserMetadataType>,
  >,
  // In the future we could specify in the payload which permission(s) we would like to fetch
  USER_PERMISSIONS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_PERMISSIONS_FETCH,
    {| ensName: ENSName |},
    WithKeyPathDepth1,
  >,
  USER_PERMISSIONS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_PERMISSIONS_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_PERMISSIONS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_PERMISSIONS_FETCH,
    {|
      ensName: ENSName,
      permissions: { +canEnterRecoveryMode?: boolean },
    |},
    WithKeyPathDepth1,
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
  USER_REMOVE_AVATAR: UniqueActionType<
    typeof ACTIONS.USER_REMOVE_AVATAR,
    void,
    void,
  >,
  USER_REMOVE_AVATAR_ERROR: ErrorActionType<
    typeof ACTIONS.USER_REMOVE_AVATAR_ERROR,
    void,
  >,
  USER_REMOVE_AVATAR_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_REMOVE_AVATAR_SUCCESS,
    {| address: string |},
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
    string[],
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
    string[],
  >,
  USER_TASK_SUBSCRIBE: ActionTypeWithPayload<
    typeof ACTIONS.USER_TASK_SUBSCRIBE,
    {| draftId: string |},
  >,
  USER_TASK_SUBSCRIBE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_TASK_SUBSCRIBE_ERROR,
    void,
  >,
  USER_TASK_SUBSCRIBE_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_TASK_SUBSCRIBE,
    {| draftId: string |},
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
  USER_UPLOAD_AVATAR: UniqueActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR,
    {| data: string |},
    void,
  >,
  USER_UPLOAD_AVATAR_ERROR: ErrorActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR_ERROR,
    void,
  >,
  USER_UPLOAD_AVATAR_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR_SUCCESS,
    {|
      address: string,
      avatar: string,
      hash: string,
    |},
    void,
  >,
|};
