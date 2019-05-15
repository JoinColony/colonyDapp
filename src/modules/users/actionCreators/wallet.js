/* @flow */

import { ACTIONS } from '~redux';
import type { Action } from '~redux';

type WalletType = 'ledger' | 'trezor';

// eslint-disable-next-line import/prefer-default-export
export const fetchAccounts = (
  walletType: WalletType,
): Action<typeof ACTIONS.WALLET_FETCH_ACCOUNTS> => ({
  type: ACTIONS.WALLET_FETCH_ACCOUNTS,
  payload: { walletType },
});
