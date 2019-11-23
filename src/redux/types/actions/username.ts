import { ErrorActionType, UniqueActionType } from './index';

import { ActionTypes } from '../../index';

export type UsernameActionTypes =
  | UniqueActionType<
      ActionTypes.USERNAME_CHECK_AVAILABILITY,
      {
        username: string;
      },
      void
    >
  | ErrorActionType<ActionTypes.USERNAME_CHECK_AVAILABILITY_ERROR, object>
  | UniqueActionType<
      ActionTypes.USERNAME_CHECK_AVAILABILITY_SUCCESS,
      void,
      object
    >
  | UniqueActionType<ActionTypes.USERNAME_CREATE, { username: string }, object>
  | ErrorActionType<ActionTypes.USERNAME_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.USERNAME_CREATE_SUCCESS,
      {
        username: string;
      },
      object
    >;
