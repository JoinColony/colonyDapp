/* @flow */

import { WALLET_FETCH_ACCOUNTS } from '../actionTypes';

type WalletType = 'ledger' | 'trezor';

// eslint-disable-next-line import/prefer-default-export
export const fetchAccounts = (walletType: WalletType) => ({
  type: WALLET_FETCH_ACCOUNTS,
  payload: { walletType },
});
