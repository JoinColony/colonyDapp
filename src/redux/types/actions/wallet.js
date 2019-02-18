/* @flow */

import type { ActionType, ErrorActionType } from '../index';

import { ACTIONS } from '../../index';

export type WalletActionTypes = {|
  WALLET_CREATE: ActionType<
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
    *,
  >,
  WALLET_CREATE_ERROR: ErrorActionType<typeof ACTIONS.WALLET_CREATE_ERROR, *>,
  WALLET_FETCH_ACCOUNTS: ActionType<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS,
    {|
      walletType: string,
    |},
    *,
  >,
  WALLET_FETCH_ACCOUNTS_ERROR: ErrorActionType<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS_ERROR,
    *,
  >,
  WALLET_FETCH_ACCOUNTS_SUCCESS: ActionType<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS,
    {|
      allAddresses: string[],
    |},
    *,
  >,
|};
