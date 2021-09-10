import { Address } from '~types/index';

import { ActionType, ErrorActionType, UniqueActionType } from './index';

import { ActionTypes } from '../../index';

export type UserActionTypes =
  | UniqueActionType<ActionTypes.USERNAME_CREATE, { username: string }, object>
  | ErrorActionType<ActionTypes.USERNAME_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.USERNAME_CREATE_SUCCESS,
      {
        username: string;
      },
      object
    >
  | UniqueActionType<ActionTypes.USER_AVATAR_REMOVE, object, object>
  | ErrorActionType<ActionTypes.USER_AVATAR_REMOVE_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_AVATAR_REMOVE_SUCCESS,
      { address: Address },
      object
    >
  | UniqueActionType<ActionTypes.USER_AVATAR_UPLOAD, { data: string }, object>
  | ErrorActionType<ActionTypes.USER_AVATAR_UPLOAD_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_AVATAR_UPLOAD_SUCCESS,
      {
        address: Address;
        avatar: string;
        hash: string | null;
      },
      object
    >
  | ActionType<ActionTypes.USER_LOGOUT>
  | ErrorActionType<ActionTypes.USER_LOGOUT_ERROR, object>
  | ActionType<ActionTypes.USER_LOGOUT_SUCCESS>
  | UniqueActionType<
      ActionTypes.USER_DEPOSIT_TOKEN,
      { colonyAddress: string; tokenAddress: string; amount: number },
      object
    >
  | ErrorActionType<ActionTypes.USER_DEPOSIT_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_DEPOSIT_TOKEN_SUCCESS,
      {
        tokenAddress: string;
        amount: number;
      },
      object
    >
  | UniqueActionType<
      ActionTypes.USER_WITHDRAW_TOKEN,
      { colonyAddress: string; tokenAddress: string; amount: number },
      object
    >
  | ErrorActionType<ActionTypes.USER_WITHDRAW_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_WITHDRAW_TOKEN_SUCCESS,
      {
        tokenAddress: string;
        amount: number;
      },
      object
    >;
