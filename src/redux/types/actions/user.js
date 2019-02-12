/* @flow */

import type { ActionType, ErrorActionType, WithKeyPathDepth1 } from '~types';
import type { ContractTransactionType, UserProfileType } from '~immutable';

import { ACTIONS } from '../../index';

export type UserActionTypes = {|
  USER_AVATAR_FETCH: ActionType<
    typeof ACTIONS.USER_AVATAR_FETCH,
    {| hash: string |},
    WithKeyPathDepth1,
  >,
  USER_AVATAR_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_AVATAR_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_AVATAR_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.USER_AVATAR_FETCH_SUCCESS,
    {|
      avatarData: string,
      hash: string,
    |},
    WithKeyPathDepth1,
  >,
  USER_FETCH_TOKEN_TRANSFERS: ActionType<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS,
    {||},
    void,
  >,
  USER_FETCH_TOKEN_TRANSFERS_ERROR: ActionType<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS_ERROR,
    {| error: string |},
    void,
  >,
  USER_FETCH_TOKEN_TRANSFERS_SUCCESS: ActionType<
    typeof ACTIONS.USER_FETCH_TOKEN_TRANSFERS_SUCCESS,
    {|
      transactions: ContractTransactionType[],
    |},
    void,
  >,
  USER_PROFILE_FETCH: ActionType<
    typeof ACTIONS.USER_PROFILE_FETCH,
    void,
    WithKeyPathDepth1,
  >,
  USER_PROFILE_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_PROFILE_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_PROFILE_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.USER_PROFILE_FETCH_SUCCESS,
    UserProfileType,
    WithKeyPathDepth1,
  >,
  USER_PROFILE_UPDATE: ActionType<
    typeof ACTIONS.USER_PROFILE_UPDATE,
    {||},
    void,
  >,
  USER_PROFILE_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_PROFILE_UPDATE_ERROR,
    void,
  >,
  USER_PROFILE_UPDATE_SUCCESS: ActionType<
    typeof ACTIONS.USER_PROFILE_UPDATE_SUCCESS,
    UserProfileType,
    void,
  >,
  USER_REMOVE_AVATAR: ActionType<typeof ACTIONS.USER_REMOVE_AVATAR, {||}, void>,
  USER_REMOVE_AVATAR_ERROR: ErrorActionType<
    typeof ACTIONS.USER_REMOVE_AVATAR_ERROR,
    void,
  >,
  USER_REMOVE_AVATAR_SUCCESS: ActionType<
    typeof ACTIONS.USER_REMOVE_AVATAR_SUCCESS,
    {||},
    void,
  >,
  USER_UPLOAD_AVATAR: ActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR,
    {| data: string |},
    void,
  >,
  USER_UPLOAD_AVATAR_ERROR: ErrorActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR_ERROR,
    void,
  >,
  USER_UPLOAD_AVATAR_SUCCESS: ActionType<
    typeof ACTIONS.USER_UPLOAD_AVATAR_SUCCESS,
    {|
      hash: string,
    |},
    void,
  >,
|};
