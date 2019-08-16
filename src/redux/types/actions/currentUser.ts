import { $Shape } from 'utility-types';

import { UserProfileType } from '~immutable/index';
import { Address, WithKey } from '~types/index';

import {
  ActionType,
  ActionTypeWithPayload,
  ErrorActionType,
  UniqueActionType,
} from './index';

import { ActionTypes } from '../../index';

export type CurrentUserActionTypes =
  | UniqueActionType<
      ActionTypes.CURRENT_USER_CREATE,
      {
        balance: string;
        profileData: $Shape<UserProfileType>;
        walletAddress: Address;
      },
      WithKey
    >
  | ActionType<ActionTypes.CURRENT_USER_GET_BALANCE>
  | ErrorActionType<ActionTypes.CURRENT_USER_GET_BALANCE_ERROR, void>
  | ActionTypeWithPayload<
      ActionTypes.CURRENT_USER_GET_BALANCE_SUCCESS,
      {
        // Apparently a string, maybe converted from BN?
        balance: string;
      }
    >;
