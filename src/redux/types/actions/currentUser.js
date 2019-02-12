/* @flow */

import type { ActionType, ErrorActionType } from '~types';

import { ACTIONS } from '../../index';

export type CurrentUserActionTypes = {|
  CURRENT_USER_CREATE: ActionType<
    typeof ACTIONS.CURRENT_USER_CREATE,
    {|
      profileData: Object,
      walletAddress: string,
      balance: number,
    |},
    void,
  >,
  CURRENT_USER_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.CURRENT_USER_CREATE_ERROR,
    void,
  >,
  CURRENT_USER_CREATE_SUCCESS: ActionType<
    typeof ACTIONS.CURRENT_USER_CREATE_SUCCESS,
    {||},
    void,
  >,
  CURRENT_USER_GET_BALANCE: ActionType<
    typeof ACTIONS.CURRENT_USER_GET_BALANCE,
    {||},
    void,
  >,
  CURRENT_USER_GET_BALANCE_ERROR: ErrorActionType<
    typeof ACTIONS.CURRENT_USER_GET_BALANCE_ERROR,
    void,
  >,
  CURRENT_USER_GET_BALANCE_SUCCESS: ActionType<
    typeof ACTIONS.CURRENT_USER_GET_BALANCE_SUCCESS,
    {|
      // Apparently a string, maybe converted from BN?
      balance: string,
    |},
    void,
  >,
|};
