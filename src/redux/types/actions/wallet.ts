import { WalletMethod } from '~immutable/index';
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
        connnectWalletMnemonic?: string;
        hardwareWalletChoice?: string;
        keystore?: string;
        method: WalletMethod;
        mnemonic?: string;
        password?: string;
        privateKey?: string;
      },
      object
    >
  | ActionTypeWithPayload<
      ActionTypes.WALLET_CREATE_SUCCESS,
      {
        walletType: WalletMethod;
      }
    >
  | ErrorActionType<ActionTypes.WALLET_CREATE_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.WALLET_FETCH_ACCOUNTS,
      {
        walletType: WalletMethod;
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
