/* @flow */

import type { WithKeyPathDepth1 } from '~types';
import type { ContractTransactionType, UserProfileType } from '~immutable';

import type { ActionType, UniqueActionType, ErrorActionType } from '../index';

import { ACTIONS } from '../../index';

export type UserActionTypes = {|
  USER_AVATAR_FETCH: ActionType<
    typeof ACTIONS.USER_AVATAR_FETCH,
    {| hash: string |},
    *,
  >,
  USER_AVATAR_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_AVATAR_FETCH_ERROR,
    *,
  >,
  USER_AVATAR_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.USER_AVATAR_FETCH_SUCCESS,
    {|
      avatarData: string,
      hash: string,
    |},
    *,
  >,
  USER_FETCH_TOKEN_TRANSFERS: ActionType<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS,
    *,
    *,
  >,
  USER_FETCH_TOKEN_TRANSFERS_ERROR: ErrorActionType<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS_ERROR,
    *,
  >,
  USER_FETCH_TOKEN_TRANSFERS_SUCCESS: ActionType<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS_SUCCESS,
    {|
      transactions: ContractTransactionType[],
    |},
    *,
  >,
  USER_PROFILE_FETCH: UniqueActionType<
    typeof ACTIONS.USER_PROFILE_FETCH,
    *,
    WithKeyPathDepth1,
  >,
  USER_PROFILE_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_PROFILE_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_PROFILE_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_PROFILE_FETCH_SUCCESS,
    UserProfileType,
    WithKeyPathDepth1,
  >,
  USER_PROFILE_UPDATE: ActionType<typeof ACTIONS.USER_PROFILE_UPDATE, *, *>,
  USER_PROFILE_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_PROFILE_UPDATE_ERROR,
    *,
  >,
  USER_PROFILE_UPDATE_SUCCESS: ActionType<
    typeof ACTIONS.USER_PROFILE_UPDATE_SUCCESS,
    UserProfileType,
    *,
  >,
  USER_REMOVE_AVATAR: ActionType<typeof ACTIONS.USER_REMOVE_AVATAR, *, *>,
  USER_REMOVE_AVATAR_ERROR: ErrorActionType<
    typeof ACTIONS.USER_REMOVE_AVATAR_ERROR,
    *,
  >,
  USER_REMOVE_AVATAR_SUCCESS: ActionType<
    typeof ACTIONS.USER_REMOVE_AVATAR_SUCCESS,
    *,
    *,
  >,
  USER_UPLOAD_AVATAR: ActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR,
    {| data: string |},
    *,
  >,
  USER_UPLOAD_AVATAR_ERROR: ErrorActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR_ERROR,
    *,
  >,
  USER_UPLOAD_AVATAR_SUCCESS: ActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR_SUCCESS,
    {|
      hash: string,
    |},
    *,
  >,
|};
