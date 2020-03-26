import { Address } from '~types/index';
import { ContractTransactionType } from '~immutable/index';

import {
  ActionType,
  ActionTypeWithPayload,
  ErrorActionType,
  UniqueActionType,
} from './index';

import { ActionTypes } from '../../index';

export type UserActionTypes =
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
        hash: string;
      },
      object
    >
  | UniqueActionType<
      ActionTypes.USER_ADDRESS_FETCH,
      { username: string },
      object
    >
  | ErrorActionType<ActionTypes.USER_ADDRESS_FETCH_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_ADDRESS_FETCH_SUCCESS,
      { userAddress: string },
      object
    >
  | ActionType<ActionTypes.USER_TOKEN_TRANSFERS_FETCH>
  | ErrorActionType<ActionTypes.USER_TOKEN_TRANSFERS_FETCH_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.USER_TOKEN_TRANSFERS_FETCH_SUCCESS,
      {
        transactions: ContractTransactionType[];
      }
    >
  | ActionType<ActionTypes.USER_LOGOUT>
  | ErrorActionType<ActionTypes.USER_LOGOUT_ERROR, object>
  | ActionType<ActionTypes.USER_LOGOUT_SUCCESS>;
