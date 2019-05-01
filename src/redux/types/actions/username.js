/* @flow */

import type { ErrorActionType, UniqueActionType } from '../index';

import { ACTIONS } from '../../index';

export type UsernameActionTypes = {|
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
    {|
      inboxStoreAddress: string,
      metadataStoreAddress: string,
      username: string,
    |},
    void,
  >,
|};
