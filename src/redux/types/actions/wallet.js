/* @flow */
import type BigNumber from 'bn.js';

import type { WalletSpecificType, WalletCategoryType } from '~immutable';
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
      method: WalletSpecificType,
      mnemonic?: *,
      password?: *,
    |},
    void,
  >,
  WALLET_CREATE_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.WALLET_CREATE_SUCCESS,
    {|
      walletType: WalletCategoryType,
    |},
  >,
  WALLET_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.WALLET_CREATE_ERROR,
    void,
  >,
  WALLET_FETCH_ACCOUNTS: ActionTypeWithPayload<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS,
    {|
      walletType: WalletSpecificType,
    |},
  >,
  WALLET_FETCH_ACCOUNTS_ERROR: ErrorActionType<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS_ERROR,
    void,
  >,
  WALLET_FETCH_ACCOUNTS_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.WALLET_FETCH_ACCOUNTS_SUCCESS,
    {|
      allAddresses: Array<{| address: Address, balance: BigNumber |}>,
    |},
  >,
|};
