/* @flow */

import type { WithKeyPathDepth1 } from '~types';
import type { ContractTransactionType, UserProfileType } from '~immutable';

import type {
  ActionType,
  ActionTypeWithMeta,
  ActionTypeWithPayload,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type UserActionTypes = {|
  USER_AVATAR_FETCH: ActionTypeWithPayload<
    typeof ACTIONS.USER_AVATAR_FETCH,
    {| hash: string |},
  >,
  USER_AVATAR_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_AVATAR_FETCH_ERROR,
    void,
  >,
  USER_AVATAR_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_AVATAR_FETCH_SUCCESS,
    {|
      avatarData: string,
      hash: string,
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
  USER_PROFILE_FETCH: ActionTypeWithMeta<
    typeof ACTIONS.USER_PROFILE_FETCH,
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
    UserProfileType,
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
    {| user: UserProfileType |}, // TODO this probably shouldn't be here
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
