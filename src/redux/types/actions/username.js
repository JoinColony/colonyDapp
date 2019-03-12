/* @flow */

import type {
  ActionTypeWithPayload,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type UsernameActionTypes = {|
  USER_ADDRESS_FETCH: ActionTypeWithPayload<
    typeof ACTIONS.USER_ADDRESS_FETCH,
    {| username: string |},
  >,
  USER_ADDRESS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ADDRESS_FETCH_ERROR,
    *,
  >,
  USER_ADDRESS_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USER_ADDRESS_FETCH_SUCCESS,
    {| address: string, username: string |},
  >,
  USERNAME_CHECK_AVAILABILITY: UniqueActionType<
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
  USERNAME_CHECK_AVAILABILITY_SUCCESS: UniqueActionType<
    typeof ACTIONS.USERNAME_CHECK_AVAILABILITY_SUCCESS,
    void,
    void,
  >,
  USERNAME_CREATE: UniqueActionType<
    typeof ACTIONS.USERNAME_CREATE,
    {| username: string |},
    void,
  >,
  USERNAME_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.USERNAME_CREATE_ERROR,
    void,
  >,
  USERNAME_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.USERNAME_CREATE_SUCCESS,
    {
      from: string,
      params: {
        username: string,
      },
    },
    void,
  >,
  USERNAME_FETCH: ActionTypeWithPayload<
    typeof ACTIONS.USERNAME_FETCH,
    {| address: string |},
  >,
  USERNAME_FETCH_ERROR: ErrorActionType<typeof ACTIONS.USERNAME_FETCH_ERROR, *>,
  USERNAME_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.USERNAME_FETCH_SUCCESS,
    {| address: string, username: string |},
  >,
|};
