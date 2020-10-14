import { WalletMethod } from '~immutable/index';
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
        connectWalletMnemonic?: string;
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
  | ActionType<ActionTypes.USER_CONTEXT_SETUP_SUCCESS>;
