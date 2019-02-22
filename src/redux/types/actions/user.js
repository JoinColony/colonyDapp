/* @flow */

import type { WithKeyPathDepth1 } from '~types';
import type { ContractTransactionType, UserProfileType } from '~immutable';

import type {
  ActionType,
  ActionTypeWithPayload,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type UserActionTypes = {|
  USER_AVATAR_FETCH: ActionTypeWithPayload<
    typeof ACTIONS.USER_AVATAR_FETCH,
    {| username: string |},
  >,
  USER_AVATAR_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_AVATAR_FETCH_ERROR,
    void,
  >,
  USER_AVATAR_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_AVATAR_FETCH_SUCCESS,
    {|
      avatar: ?string,
      username: string,
    |},
  >,
  USER_FETCH_TOKEN_TRANSFERS: ActionType<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS,
  >,
  USER_FETCH_TOKEN_TRANSFERS_ERROR: ErrorActionType<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS_ERROR,
    void,
  >,
  USER_FETCH_TOKEN_TRANSFERS_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS_SUCCESS,
    {|
      transactions: ContractTransactionType[],
    |},
  >,
  USER_PROFILE_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_PROFILE_FETCH,
    {| username: string |},
    WithKeyPathDepth1,
  >,
  USER_PROFILE_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_PROFILE_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_PROFILE_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_PROFILE_FETCH_SUCCESS,
    UserProfileType,
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
    {| username: string |},
    void,
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
      hash: string,
    |},
    void,
  >,
|};
