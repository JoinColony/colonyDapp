/* @flow */

import type { ActionType, ErrorActionType } from '../index';

import { ACTIONS } from '../../index';

export type TokenActionTypes = {|
  TOKEN_CREATE: ActionType<
    typeof ACTIONS.TOKEN_CREATE,
    {|
      tokenName: string,
      tokenSymbol: string,
    |},
    *,
  >,
  TOKEN_CREATE_ERROR: ErrorActionType<typeof ACTIONS.TOKEN_CREATE_ERROR, *>,
  TOKEN_CREATE_SUCCESS: ActionType<typeof ACTIONS.TOKEN_CREATE_SUCCESS, *, *>,
  TOKEN_ICON_FETCH: ActionType<
    typeof ACTIONS.TOKEN_ICON_FETCH,
    {| hash: string |},
    *,
  >,
  TOKEN_ICON_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.TOKEN_ICON_FETCH_ERROR,
    *,
  >,
  TOKEN_ICON_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.TOKEN_ICON_FETCH_SUCCESS,
    *,
    *,
  >,
  TOKEN_ICON_UPLOAD: ActionType<
    typeof ACTIONS.TOKEN_ICON_UPLOAD,
    {|
      data: string,
    |},
    *,
  >,
  TOKEN_ICON_UPLOAD_ERROR: ErrorActionType<
    typeof ACTIONS.TOKEN_ICON_UPLOAD_ERROR,
    *,
  >,
  TOKEN_ICON_UPLOAD_SUCCESS: ActionType<
    typeof ACTIONS.TOKEN_ICON_UPLOAD_SUCCESS,
    *,
    *,
  >,
  TOKEN_INFO_FETCH: ActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH,
    {|
      tokenAddress: string,
    |},
    *,
  >,
  TOKEN_INFO_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH_ERROR,
    *,
  >,
  TOKEN_INFO_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH_SUCCESS,
    *,
    *,
  >,
|};
