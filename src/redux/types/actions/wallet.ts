import { WALLET_SPECIFICS, WALLET_CATEGORIES } from '~immutable/index';
import { Address } from '~types/index';
import {
  ActionType,
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
        method: WALLET_SPECIFICS | 'create';
        mnemonic?: any;
        password?: any;
      },
      object
    >
  | ActionTypeWithPayload<
      ActionTypes.WALLET_CREATE_SUCCESS,
      {
        walletType: WALLET_CATEGORIES;
      }
    >
  | ErrorActionType<ActionTypes.WALLET_CREATE_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.WALLET_FETCH_ACCOUNTS,
      {
        walletType: WALLET_SPECIFICS;
      }
    >
  | ErrorActionType<ActionTypes.WALLET_FETCH_ACCOUNTS_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.WALLET_FETCH_ACCOUNTS_SUCCESS,
      {
        allAddresses: Address[];
      }
    >
  | ActionType<ActionTypes.USER_CONTEXT_SETUP_SUCCESS>;
