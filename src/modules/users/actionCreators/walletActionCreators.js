/* @flow */

import { ACTIONS } from '~redux';

type WalletType = 'ledger' | 'trezor';

// eslint-disable-next-line import/prefer-default-export
export const fetchAccounts = (walletType: WalletType) => ({
  type: ACTIONS.WALLET_FETCH_ACCOUNTS,
  payload: { walletType },
});
