/* @flow */

import type { ActionType, ErrorActionType, UniqueActionType } from '../index';

import { ACTIONS } from '../../index';

export type UsernameActionTypes = {|
  USERNAME_CHECK_AVAILABILITY: UniqueActionType<
    typeof ACTIONS.USERNAME_CHECK_AVAILABILITY,
    {|
      username: string,
    |},
    *,
  >,
  USERNAME_CHECK_AVAILABILITY_ERROR: ErrorActionType<
    typeof ACTIONS.USERNAME_CHECK_AVAILABILITY_ERROR,
    *,
  >,
  USERNAME_CHECK_AVAILABILITY_SUCCESS: UniqueActionType<
    typeof ACTIONS.USERNAME_CHECK_AVAILABILITY_SUCCESS,
    *,
    *,
  >,
  USERNAME_CREATE: UniqueActionType<
    typeof ACTIONS.USERNAME_CREATE,
    {| username: string |},
    *,
  >,
  USERNAME_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.USERNAME_CREATE_ERROR,
    *,
  >,
  USERNAME_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.USERNAME_CREATE_SUCCESS,
    {|
      params: {
        username: string,
      },
    |},
    *,
  >,
  USERNAME_FETCH: ActionType<
    typeof ACTIONS.USERNAME_FETCH,
    {| userAddress: string |},
    *,
  >,
  USERNAME_FETCH_ERROR: ErrorActionType<typeof ACTIONS.USERNAME_FETCH_ERROR, *>,
  USERNAME_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.USERNAME_FETCH_SUCCESS,
    {| key: string, username: string |},
    *,
  >,
|};
