/* @flow */

import type { ActionType, ErrorActionType } from '~types';

import { ACTIONS } from '../../index';

export type UsernameActionTypes = {|
  USERNAME_CHECK_AVAILABILITY: ActionType<
    typeof ACTIONS.USERNAME_CHECK_AVAILABILITY,
    {|
      username: string,
    |},
    void,
  >,
  USERNAME_CHECK_AVAILABILITY_ERROR: ErrorActionType<
    typeof ACTIONS.USERNAME_CHECK_AVAILABILITY_ERROR,
    void,
  >,
  USERNAME_CHECK_AVAILABILITY_SUCCESS: ActionType<
    typeof ACTIONS.USERNAME_CHECK_AVAILABILITY_SUCCESS,
    void,
    void,
  >,
  USERNAME_CREATE: ActionType<
    typeof ACTIONS.USERNAME_CREATE,
    {| username: string |},
    void,
  >,
  USERNAME_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.USERNAME_CREATE_ERROR,
    void,
  >,
  USERNAME_CREATE_SUCCESS: ActionType<
    typeof ACTIONS.USERNAME_CREATE_SUCCESS,
    {|
      params: {
        username: string,
      },
    |},
    void,
  >,
  USERNAME_CREATE_TX_CREATED: ActionType<
    typeof ACTIONS.USERNAME_CREATE_TX_CREATED,
    {||},
    void,
  >,
  USERNAME_FETCH: ActionType<
    typeof ACTIONS.USERNAME_FETCH,
    {| userAddress: string |},
    void,
  >,
  USERNAME_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USERNAME_FETCH_ERROR,
    void,
  >,
  USERNAME_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.USERNAME_FETCH_SUCCESS,
    {| key: string, username: string |},
    void,
  >,
|};
