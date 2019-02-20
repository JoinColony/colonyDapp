/* @flow */

import type {
  Action,
  ActionTypeWithPayload,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type TokenActionTypes = {|
  TOKEN_CREATE: UniqueActionType<
    typeof ACTIONS.TOKEN_CREATE,
    {|
      tokenName: string,
      tokenSymbol: string,
    |},
    void,
  >,
  TOKEN_CREATE_ERROR: ErrorActionType<typeof ACTIONS.TOKEN_CREATE_ERROR, void>,
  TOKEN_CREATE_SUCCESS: Action<typeof ACTIONS.TRANSACTION_RECEIPT_RECEIVED>,
  TOKEN_ICON_FETCH: ActionTypeWithPayload<
    typeof ACTIONS.TOKEN_ICON_FETCH,
    {| hash: string |},
  >,
  TOKEN_ICON_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.TOKEN_ICON_FETCH_ERROR,
    void,
  >,
  TOKEN_ICON_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.TOKEN_ICON_FETCH_SUCCESS,
    {| hash: string, iconData: string |},
  >,
  TOKEN_ICON_UPLOAD: UniqueActionType<
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
  TOKEN_ICON_UPLOAD_SUCCESS: UniqueActionType<
    typeof ACTIONS.TOKEN_ICON_UPLOAD_SUCCESS,
    {| hash: string |},
    void,
  >,
  TOKEN_INFO_FETCH: UniqueActionType<
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
  TOKEN_INFO_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH_SUCCESS,
    {|
      decimals: number,
      name: string,
      symbol: string,
      tokenAddress: string,
    |},
    void,
  >,
|};
