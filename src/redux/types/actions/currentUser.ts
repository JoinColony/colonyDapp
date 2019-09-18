import { $Shape } from 'utility-types';

import { UserProfileType } from '~immutable/index';
import { Address, WithKey } from '~types/index';

import { ActionTypeWithPayload, UniqueActionType } from './index';

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
  | ActionTypeWithPayload<
      ActionTypes.CURRENT_USER_BALANCE,
      {
        // Apparently a string, maybe converted from BN?
        balance: string;
      }
    >;
