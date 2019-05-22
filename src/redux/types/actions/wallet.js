/* @flow */

import type { Address } from '~types';
import type {
  ActionTypeWithPayload,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type WalletActionTypes = {|
  WALLET_CREATE: UniqueActionType<
    typeof ACTIONS.WALLET_CREATE,
    {|
      accountIndex?: number,
      connectwalletmnemonic?: *,
      hardwareWalletChoice?: *,
      keystore?: *,
      method: string,
      mnemonic?: *,
      password?: *,
    |},
    void,
  >,
  WALLET_CREATE_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.WALLET_CREATE_SUCCESS,
    {|
      walletType: string,
    |},
  >,
  WALLET_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.WALLET_CREATE_ERROR,
    void,
  >,
  WALLET_FETCH_ACCOUNTS: ActionTypeWithPayload<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS,
    {|
      walletType: string,
    |},
  >,
  WALLET_FETCH_ACCOUNTS_ERROR: ErrorActionType<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS_ERROR,
    void,
  >,
  WALLET_FETCH_ACCOUNTS_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS,
    {|
      allAddresses: Address[],
    |},
  >,
|};
