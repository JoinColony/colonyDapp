/* @flow */

import type { ActionType, ErrorActionType } from '~types';

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
    void,
  >,
  WALLET_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.WALLET_CREATE_ERROR,
    void,
  >,
  WALLET_FETCH_ACCOUNTS: ActionType<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS,
    {|
      walletType: string,
    |},
    void,
  >,
  WALLET_FETCH_ACCOUNTS_ERROR: ErrorActionType<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS_ERROR,
    void,
  >,
  WALLET_FETCH_ACCOUNTS_SUCCESS: ActionType<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS,
    {|
      allAddresses: string[],
    |},
    void,
  >,
|};
