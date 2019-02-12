/* @flow */

import type { ActionType, ErrorActionType } from '~types';

import { ACTIONS } from '../../index';

export type TokenActionTypes = {|
  TOKEN_CREATE: ActionType<
    typeof ACTIONS.TOKEN_CREATE,
    {|
      tokenName: string,
      tokenSymbol: string,
    |},
    void,
  >,
  TOKEN_CREATE_ERROR: ErrorActionType<typeof ACTIONS.TOKEN_CREATE_ERROR, void>,
  TOKEN_CREATE_SUCCESS: ActionType<
    typeof ACTIONS.TOKEN_CREATE_SUCCESS,
    {||},
    void,
  >,
  TOKEN_ICON_FETCH: ActionType<
    typeof ACTIONS.TOKEN_ICON_FETCH,
    {| hash: string |},
    void,
  >,
  TOKEN_ICON_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.TOKEN_ICON_FETCH_ERROR,
    void,
  >,
  TOKEN_ICON_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.TOKEN_ICON_FETCH_SUCCESS,
    {||},
    void,
  >,
  TOKEN_ICON_UPLOAD: ActionType<
    typeof ACTIONS.TOKEN_ICON_UPLOAD,
    {|
      data: string,
    |},
    void,
  >,
  TOKEN_ICON_UPLOAD_ERROR: ErrorActionType<
    typeof ACTIONS.TOKEN_ICON_UPLOAD_ERROR,
    void,
  >,
  TOKEN_ICON_UPLOAD_SUCCESS: ActionType<
    typeof ACTIONS.TOKEN_ICON_UPLOAD_SUCCESS,
    {||},
    void,
  >,
  TOKEN_INFO_FETCH: ActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH,
    {|
      tokenAddress: string,
    |},
    void,
  >,
  TOKEN_INFO_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH_ERROR,
    void,
  >,
  TOKEN_INFO_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH_SUCCESS,
    {||},
    void,
  >,
|};
