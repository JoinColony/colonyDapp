import { WalletSpecificType, WalletCategoryType } from '~immutable/index';
import { Address } from '~types/index';
import {
  ActionTypeWithPayload,
  ErrorActionType,
  UniqueActionType,
} from './index';

import { ActionTypes } from '../../index';

export type WalletActionTypes =
  | UniqueActionType<
      ActionTypes.WALLET_CREATE,
      {
        accountIndex?: number;
        connectwalletmnemonic?: any;
        hardwareWalletChoice?: any;
        keystore?: any;
        method: WalletSpecificType;
        mnemonic?: any;
        password?: any;
      },
      object
    >
  | ActionTypeWithPayload<
      ActionTypes.WALLET_CREATE_SUCCESS,
      {
        walletType: WalletCategoryType;
      }
    >
  | ErrorActionType<ActionTypes.WALLET_CREATE_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.WALLET_FETCH_ACCOUNTS,
      {
        walletType: WalletSpecificType;
      }
    >
  | ErrorActionType<ActionTypes.WALLET_FETCH_ACCOUNTS_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.WALLET_FETCH_ACCOUNTS_SUCCESS,
      {
        allAddresses: Address[];
      }
    >;
