/* @flow */

import type { Action, ErrorActionType, UniqueActionType } from '../index';
import type { WithKeyPathDepth1 } from '~types';

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
  TOKEN_INFO_FETCH: UniqueActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH,
    {|
      tokenAddress: string,
    |},
    WithKeyPathDepth1,
  >,
  TOKEN_INFO_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  TOKEN_INFO_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.TOKEN_INFO_FETCH_SUCCESS,
    {|
      decimals: number,
      name: string,
      symbol: string,
      tokenAddress: string,
    |},
    WithKeyPathDepth1,
  >,
|};
